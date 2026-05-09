import React, { createContext, useContext, useEffect, useState } from "react";
import initialQuestions from "../data/questions.json";

const QuizContext = createContext();
const STORAGE_KEY = "se_quiz_data";
const DEFAULT_SUBJECT = "Môn TM";
const DEFAULT_CHAPTER = "Chưa phân chương";

const inferSubjectFromChapter = (chapterName) => {
    if (typeof chapterName !== "string") return DEFAULT_SUBJECT;
    const matched = chapterName.match(/\d+/);
    const chapterNo = matched ? parseInt(matched[0], 10) : null;
    if (!chapterNo) return DEFAULT_SUBJECT;
    if (chapterNo <= 3) return "Xử lý ảnh số";
    if (chapterNo <= 6) return "Biến đổi ảnh";
    return "Nhận dạng ảnh";
};

const normalizeQuestion = (question) => {
    const subject =
        typeof question.subject === "string" && question.subject.trim()
            ? question.subject.trim()
            : inferSubjectFromChapter(question.chapter);
    const chapter =
        typeof question.chapter === "string" && question.chapter.trim()
            ? question.chapter.trim()
            : DEFAULT_CHAPTER;

    return {
        ...question,
        subject,
        chapter,
        options: Array.isArray(question.options) ? question.options : [],
    };
};

const normalizeQuestions = (questions) =>
    Array.isArray(questions) ? questions.map(normalizeQuestion) : [];

const readInitialQuestions = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return normalizeQuestions(initialQuestions);

    try {
        return normalizeQuestions(JSON.parse(saved));
    } catch {
        return normalizeQuestions(initialQuestions);
    }
};

export const QuizProvider = ({ children }) => {
    const [allQuestions, setAllQuestions] = useState(readInitialQuestions);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });
    const [userAnswers, setUserAnswers] = useState({});

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allQuestions));
    }, [allQuestions]);

    const startQuiz = (selectionOrChapter, maybeLimit = 0) => {
        const isLegacyMode = typeof selectionOrChapter === "string";
        const selection = isLegacyMode
            ? {
                  subject: "All",
                  chapter: selectionOrChapter,
                  limit: maybeLimit,
              }
            : {
                  subject: selectionOrChapter?.subject || "All",
                  chapter: selectionOrChapter?.chapter || "All",
                  limit: selectionOrChapter?.limit || 0,
              };

        const subjectFiltered =
            selection.subject === "All"
                ? allQuestions
                : allQuestions.filter((q) => q.subject === selection.subject);
        const chapterFiltered =
            selection.chapter === "All"
                ? subjectFiltered
                : subjectFiltered.filter((q) => q.chapter === selection.chapter);

        let finalQuestions = chapterFiltered.map((q) => ({
            ...q,
            options: q.options,
        }));

        if (
            selection.limit > 0 &&
            Number.isFinite(selection.limit) &&
            selection.limit < finalQuestions.length
        ) {
            finalQuestions = finalQuestions.slice(0, selection.limit);
        }

        setQuizQuestions(finalQuestions);
        setScore({ correct: 0, wrong: 0, total: finalQuestions.length });
        setUserAnswers({});
    };

    const handleAnswer = (questionId, isCorrect, option) => {
        if (!userAnswers[questionId]) {
            setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
            if (isCorrect) {
                setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
            } else {
                setScore((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
            }
        }
    };

    const importQuestions = (jsonData) => {
        const normalized = normalizeQuestions(jsonData);
        if (!normalized.length) {
            return { added: 0, updated: 0, total: 0 };
        }

        const byId = new Map(allQuestions.map((q) => [q.id, q]));
        let added = 0;
        let updated = 0;

        normalized.forEach((q) => {
            if (byId.has(q.id)) {
                updated += 1;
            } else {
                added += 1;
            }
            byId.set(q.id, q);
        });

        setAllQuestions(Array.from(byId.values()));
        return { added, updated, total: normalized.length };
    };

    const replaceAllQuestions = (jsonData) => {
        const normalized = normalizeQuestions(jsonData);
        setAllQuestions(normalized);
        return normalized.length;
    };

    const restoreBundledQuestions = () => {
        const normalized = normalizeQuestions(initialQuestions);
        setAllQuestions(normalized);
        return normalized.length;
    };

    const clearLocalData = () => {
        localStorage.removeItem(STORAGE_KEY);
        const normalized = normalizeQuestions(initialQuestions);
        setAllQuestions(normalized);
        return normalized.length;
    };

    const addQuestion = (newQ) => {
        setAllQuestions([
            ...allQuestions,
            normalizeQuestion({ ...newQ, id: Date.now() }),
        ]);
    };

    const deleteQuestion = (id) => {
        setAllQuestions(allQuestions.filter((q) => q.id !== id));
    };

    const exportData = () => {
        const blob = new Blob([JSON.stringify(allQuestions, null, 2)], {
            type: "application/json;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "questions-export.json";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const subjects = [...new Set(allQuestions.map((q) => q.subject))];
    const chapters = [...new Set(allQuestions.map((q) => q.chapter))];

    const getChaptersBySubject = (subject) => {
        const source =
            subject === "All"
                ? allQuestions
                : allQuestions.filter((q) => q.subject === subject);
        return [...new Set(source.map((q) => q.chapter))];
    };

    const deleteQuestionsByChapter = (chapterName, subjectName = null) => {
        const targetLabel = subjectName
            ? `${subjectName} - ${chapterName}`
            : chapterName;

        if (
            window.confirm(
                `Bạn có chắc muốn xóa toàn bộ câu hỏi thuộc "${targetLabel}" không? Hành động này không thể hoàn tác.`
            )
        ) {
            const remainingQuestions = allQuestions.filter(
                (q) =>
                    !(
                        q.chapter === chapterName &&
                        (!subjectName || q.subject === subjectName)
                    )
            );
            setAllQuestions(remainingQuestions);
            alert(`Đã xóa thành công câu hỏi thuộc: ${targetLabel}`);
        }
    };

    return (
        <QuizContext.Provider
            value={{
                allQuestions,
                quizQuestions,
                subjects,
                chapters,
                getChaptersBySubject,
                startQuiz,
                score,
                userAnswers,
                handleAnswer,
                addQuestion,
                deleteQuestion,
                importQuestions,
                replaceAllQuestions,
                restoreBundledQuestions,
                clearLocalData,
                exportData,
                deleteQuestionsByChapter,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
};

export const useQuiz = () => useContext(QuizContext);
