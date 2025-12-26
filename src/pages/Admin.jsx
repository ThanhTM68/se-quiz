import React, { useState } from "react";
import { useQuiz } from "../context/QuizContext";
import { Trash2, Download, Plus, Save } from "lucide-react";

export default function Admin() {
    const { allQuestions, addQuestion, deleteQuestion, exportData } = useQuiz();
    const [form, setForm] = useState({
        chapter: "",
        question: "",
        opt1: "",
        opt2: "",
        opt3: "",
        opt4: "",
        answer: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const newQ = {
            chapter: form.chapter,
            question: form.question,
            options: [form.opt1, form.opt2, form.opt3, form.opt4],
            answer: form.answer,
        };
        addQuestion(newQ);
        alert("Đã thêm câu hỏi!");
        setForm({
            ...form,
            question: "",
            opt1: "",
            opt2: "",
            opt3: "",
            opt4: "",
            answer: "",
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    Quản lý Ngân hàng câu hỏi
                </h2>
                <button
                    onClick={exportData}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition"
                >
                    <Download size={16} /> Xuất file JSON
                </button>
            </div>

            {/* Add Form */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Plus size={20} /> Thêm câu hỏi mới
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            placeholder="Tên chương (VD: Chương 1)"
                            required
                            className="glass-input"
                            value={form.chapter}
                            onChange={(e) =>
                                setForm({ ...form, chapter: e.target.value })
                            }
                        />
                        <input
                            placeholder="Nội dung câu hỏi"
                            required
                            className="glass-input"
                            value={form.question}
                            onChange={(e) =>
                                setForm({ ...form, question: e.target.value })
                            }
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <input
                                key={i}
                                placeholder={`Đáp án ${i}`}
                                required
                                className="glass-input"
                                value={form[`opt${i}`]}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        [`opt${i}`]: e.target.value,
                                    })
                                }
                            />
                        ))}
                    </div>

                    <input
                        placeholder="Đáp án đúng (Copy y hệt 1 trong 4 đáp án trên)"
                        required
                        className="glass-input border-green-500/50"
                        value={form.answer}
                        onChange={(e) =>
                            setForm({ ...form, answer: e.target.value })
                        }
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-bold transition"
                    >
                        Lưu câu hỏi
                    </button>
                </form>
            </div>

            {/* List Questions */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold">
                    Danh sách hiện tại ({allQuestions.length} câu)
                </h3>
                {allQuestions.map((q) => (
                    <div
                        key={q.id}
                        className="glass-panel p-4 flex justify-between items-start gap-4"
                    >
                        <div>
                            <span className="text-xs text-blue-300 font-bold uppercase">
                                {q.chapter}
                            </span>
                            <p className="font-semibold mt-1">{q.question}</p>
                            <p className="text-sm text-green-400 mt-1">
                                Đúng: {q.answer}
                            </p>
                        </div>
                        <button
                            onClick={() => deleteQuestion(q.id)}
                            className="text-red-400 hover:text-red-300 p-2"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
