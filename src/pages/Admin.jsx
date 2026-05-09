import React, { useMemo, useRef, useState } from "react";
import { useQuiz } from "../context/QuizContext";
import {
    Trash2,
    Download,
    Upload,
    Plus,
    FileJson,
    RotateCcw,
    DatabaseZap,
} from "lucide-react";
import QuestionContent from "../components/QuestionContent";

export default function Admin() {
    const {
        allQuestions,
        addQuestion,
        deleteQuestion,
        importQuestions,
        replaceAllQuestions,
        restoreBundledQuestions,
        clearLocalData,
        exportData,
        subjects,
        deleteQuestionsByChapter,
    } = useQuiz();
    const fileInputRef = useRef(null);
    const replaceFileInputRef = useRef(null);

    const [form, setForm] = useState({
        subject: "",
        chapter: "",
        question: "",
        opt1: "",
        opt2: "",
        opt3: "",
        opt4: "",
        answer: "",
    });
    const [search, setSearch] = useState("");

    const chapterPairs = useMemo(() => {
        const keySet = new Set();
        const pairs = [];
        allQuestions.forEach((q) => {
            const key = `${q.subject}|||${q.chapter}`;
            if (!keySet.has(key)) {
                keySet.add(key);
                pairs.push({ subject: q.subject, chapter: q.chapter });
            }
        });
        return pairs;
    }, [allQuestions]);

    const displayedQuestions = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        const source = allQuestions.slice().reverse();
        if (!keyword) return source;
        return source.filter((q) => {
            const text =
                `${q.subject} ${q.chapter} ${q.question}`.toLowerCase();
            return text.includes(keyword);
        });
    }, [allQuestions, search]);

    const handleSubmit = (e) => {
        e.preventDefault();
        addQuestion({
            subject: form.subject.trim(),
            chapter: form.chapter.trim(),
            question: form.question,
            options: [form.opt1, form.opt2, form.opt3, form.opt4],
            answer: form.answer.trim().toUpperCase(),
        });
        alert("Đã thêm câu hỏi.");
        setForm((prev) => ({
            ...prev,
            question: "",
            opt1: "",
            opt2: "",
            opt3: "",
            opt4: "",
            answer: "",
        }));
    };

    const handleImportFile = (file, mode = "merge") => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                if (!Array.isArray(json)) {
                    alert("File JSON không đúng định dạng mảng (Array).");
                    return;
                }

                if (mode === "replace") {
                    const count = replaceAllQuestions(json);
                    alert(`Đã thay thế toàn bộ dữ liệu bằng ${count} câu hỏi.`);
                    return;
                }

                const result = importQuestions(json);
                alert(
                    `Đã nhập ${result.total} câu. Thêm mới: ${result.added}, cập nhật: ${result.updated}.`,
                );
            } catch {
                alert("Lỗi đọc file JSON.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">
                        Quản lý Ngân hàng câu hỏi
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Hiện có:{" "}
                        <span className="text-blue-400 font-bold">
                            {allQuestions.length}
                        </span>{" "}
                        câu hỏi
                    </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                            handleImportFile(e.target.files[0], "merge");
                            e.target.value = null;
                        }}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow-lg shadow-blue-900/20"
                    >
                        <Upload size={16} /> Nhập JSON
                    </button>

                    <input
                        type="file"
                        ref={replaceFileInputRef}
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                            handleImportFile(e.target.files[0], "replace");
                            e.target.value = null;
                        }}
                    />
                    <button
                        onClick={() => replaceFileInputRef.current?.click()}
                        className="bg-amber-600 hover:bg-amber-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow-lg shadow-amber-900/20"
                    >
                        <DatabaseZap size={16} /> Ghi Đè JSON
                    </button>

                    <button
                        onClick={exportData}
                        className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow-lg shadow-purple-900/20"
                    >
                        <Download size={16} /> Xuất Dữ Liệu
                    </button>

                    <button
                        onClick={() => {
                            const count = restoreBundledQuestions();
                            alert(
                                `Đã khôi phục dữ liệu gốc từ questions.json (${count} câu).`,
                            );
                        }}
                        className="bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow-lg shadow-emerald-900/20"
                    >
                        <RotateCcw size={16} /> Khôi Phục Gốc
                    </button>

                    <button
                        onClick={() => {
                            if (
                                confirm(
                                    "Xóa dữ liệu local và nạp lại từ questions.json?",
                                )
                            ) {
                                const count = clearLocalData();
                                alert(
                                    `Đã reset local data, nạp lại ${count} câu từ questions.json.`,
                                );
                            }
                        }}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-bold transition"
                    >
                        Reset Local
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    <div className="glass-panel p-6 sticky top-4">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-300">
                            <Plus size={20} /> Thêm thủ công
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                placeholder="Tên môn học"
                                required
                                className="glass-input text-sm"
                                value={form.subject}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        subject: e.target.value,
                                    }))
                                }
                                list="subject-list"
                            />
                            <datalist id="subject-list">
                                {subjects.map((subject) => (
                                    <option key={subject} value={subject} />
                                ))}
                            </datalist>

                            <input
                                placeholder="Tên chương"
                                required
                                className="glass-input text-sm"
                                value={form.chapter}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        chapter: e.target.value,
                                    }))
                                }
                            />

                            <textarea
                                placeholder="Nội dung câu hỏi..."
                                required
                                rows={3}
                                className="glass-input text-sm resize-none"
                                value={form.question}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        question: e.target.value,
                                    }))
                                }
                            />

                            <div className="space-y-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <input
                                        key={i}
                                        placeholder={`Đáp án ${i}`}
                                        required
                                        className="glass-input text-sm py-1"
                                        value={form[`opt${i}`]}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                [`opt${i}`]: e.target.value,
                                            }))
                                        }
                                    />
                                ))}
                            </div>

                            <input
                                placeholder="Đáp án đúng (A/B/C/D)"
                                required
                                className="glass-input text-sm border-green-500/30 focus:border-green-500"
                                value={form.answer}
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        answer: e.target.value,
                                    }))
                                }
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-600/80 hover:bg-blue-500 py-2 rounded-lg font-bold transition mt-2"
                            >
                                Lưu câu hỏi
                            </button>
                        </form>
                    </div>

                    <div className="glass-panel p-4 text-xs text-gray-400">
                        <h4 className="font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <FileJson size={14} /> Định dạng JSON mẫu:
                        </h4>
                        <pre className="bg-black/40 p-2 rounded overflow-x-auto font-mono text-gray-500">
                            {`[
  {
    "id": 1,
    "subject": "Tên môn học",
    "chapter": "Tên chương",
    "question": "Câu hỏi?",
    "options": ["Nội dung A", "Nội dung B", "Nội dung C", "Nội dung D"],
    "answer": "A"
  }
]`}
                        </pre>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-5 border border-white/10">
                        <h3 className="text-lg font-bold text-blue-300 mb-4 border-b border-white/10 pb-2">
                            Quản lý Chương ({chapterPairs.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                            {chapterPairs.map((item) => (
                                <div
                                    key={`${item.subject}-${item.chapter}`}
                                    className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition gap-3"
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="font-bold text-sm text-white truncate"
                                            title={item.chapter}
                                        >
                                            {item.chapter}
                                        </p>
                                        <p
                                            className="text-xs text-blue-300 truncate"
                                            title={item.subject}
                                        >
                                            {item.subject}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            deleteQuestionsByChapter(
                                                item.chapter,
                                                item.subject,
                                            )
                                        }
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded text-xs transition"
                                    >
                                        <Trash2 size={14} /> Xóa
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-300">
                        Danh sách câu hỏi
                    </h3>
                    <input
                        className="glass-input"
                        placeholder="Tìm theo môn, chương hoặc nội dung câu hỏi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="space-y-3">
                        {displayedQuestions.map((q) => (
                            <div
                                key={q.id}
                                className="glass-panel p-4 flex gap-4 group hover:border-blue-500/30 transition"
                            >
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-blue-300">
                                            {q.subject}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-purple-300">
                                            {q.chapter}
                                        </span>
                                    </div>
                                    <QuestionContent
                                        text={q.question}
                                        className="font-medium mt-2 text-white/90"
                                    />
                                    <div className="mt-2 text-sm text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                                        {q.options.map((opt, i) => {
                                            const label = String.fromCharCode(
                                                65 + i,
                                            );
                                            const isCorrect =
                                                q.answer === label;
                                            return (
                                                <span
                                                    key={i}
                                                    className={
                                                        isCorrect
                                                            ? "text-green-400 font-bold"
                                                            : ""
                                                    }
                                                >
                                                    {label}. {opt}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (
                                            confirm(
                                                "Bạn có chắc muốn xóa câu này?",
                                            )
                                        ) {
                                            deleteQuestion(q.id);
                                        }
                                    }}
                                    className="text-gray-600 hover:text-red-400 self-start p-2 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {displayedQuestions.length === 0 && (
                            <div className="glass-panel p-4 text-sm text-gray-400">
                                Không có câu hỏi phù hợp.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
