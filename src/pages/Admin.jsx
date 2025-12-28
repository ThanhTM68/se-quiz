import React, { useState, useRef } from "react";
import { useQuiz } from "../context/QuizContext";
import { Trash2, Download, Upload, Plus, FileJson } from "lucide-react";

export default function Admin() {
    const {
        allQuestions,
        addQuestion,
        deleteQuestion,
        importQuestions,
        exportData,
        chapters,
        deleteQuestionsByChapter,
    } = useQuiz();
    const fileInputRef = useRef(null);

    // State form nhập tay
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

    // Xử lý Upload file
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                if (Array.isArray(json)) {
                    const count = importQuestions(json);
                    alert(`Đã nhập thành công ${count} câu hỏi mới!`);
                } else {
                    alert("File JSON không đúng định dạng mảng (Array)!");
                }
            } catch (err) {
                alert("Lỗi đọc file JSON!");
            }
        };
        reader.readAsText(file);
        // Reset input để chọn lại cùng file nếu muốn
        e.target.value = null;
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

                <div className="flex gap-3">
                    {/* Nút Upload ẩn, kích hoạt qua label hoặc ref */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow-lg shadow-blue-900/20"
                    >
                        <Upload size={16} /> Nhập File JSON
                    </button>

                    <button
                        onClick={exportData}
                        className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition shadow-lg shadow-purple-900/20"
                    >
                        <Download size={16} /> Xuất Dữ Liệu
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cột Trái: Form Thêm Thủ Công */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="glass-panel p-6 sticky top-4">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-300">
                            <Plus size={20} /> Thêm thủ công
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                placeholder="Tên chương"
                                required
                                className="glass-input text-sm"
                                value={form.chapter}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        chapter: e.target.value,
                                    })
                                }
                            />

                            <textarea
                                placeholder="Nội dung câu hỏi..."
                                required
                                rows={3}
                                className="glass-input text-sm resize-none"
                                value={form.question}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        question: e.target.value,
                                    })
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
                                            setForm({
                                                ...form,
                                                [`opt${i}`]: e.target.value,
                                            })
                                        }
                                    />
                                ))}
                            </div>

                            <input
                                placeholder="Đáp án đúng (Copy y hệt)"
                                required
                                className="glass-input text-sm border-green-500/30 focus:border-green-500"
                                value={form.answer}
                                onChange={(e) =>
                                    setForm({ ...form, answer: e.target.value })
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

                    {/* Hướng dẫn định dạng JSON */}
                    <div className="glass-panel p-4 text-xs text-gray-400">
                        <h4 className="font-bold text-gray-300 mb-2 flex items-center gap-2">
                            <FileJson size={14} /> Định dạng file JSON mẫu:
                        </h4>
                        <pre className="bg-black/40 p-2 rounded overflow-x-auto font-mono text-gray-500">
                            {`[
  {
    "id": 1,
    "chapter": "Tên chương",
    "question": "Câu hỏi?",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }
]`}
                        </pre>
                    </div>
                </div>

                {/* Cột Phải: Danh sách câu hỏi */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-5 border border-white/10">
                        <h3 className="text-lg font-bold text-blue-300 mb-4 border-b border-white/10 pb-2">
                            Quản lý Chương ({chapters.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                            {chapters.map((chap, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition"
                                >
                                    <span
                                        className="font-bold text-sm text-white truncate max-w-[150px]"
                                        title={chap}
                                    >
                                        {chap}
                                    </span>
                                    <button
                                        onClick={() =>
                                            deleteQuestionsByChapter(chap)
                                        }
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded text-xs transition"
                                    >
                                        <Trash2 size={14} /> Xóa
                                    </button>
                                </div>
                            ))}
                            {chapters.length === 0 && (
                                <p className="text-gray-500 text-sm">
                                    Chưa có dữ liệu chương.
                                </p>
                            )}
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-300">
                        Danh sách câu hỏi
                    </h3>
                    <div className="space-y-3">
                        {allQuestions
                            .slice()
                            .reverse()
                            .map((q) => (
                                <div
                                    key={q.id}
                                    className="glass-panel p-4 flex gap-4 group hover:border-blue-500/30 transition"
                                >
                                    <div className="flex-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-blue-300">
                                            {q.chapter}
                                        </span>
                                        <p className="font-medium mt-2 text-white/90">
                                            {q.question}
                                        </p>
                                        <div className="mt-2 text-sm text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1">
                                            {q.options.map((opt, i) => (
                                                <span
                                                    key={i}
                                                    className={
                                                        opt === q.answer
                                                            ? "text-green-400 font-bold"
                                                            : ""
                                                    }
                                                >
                                                    - {opt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Bạn có chắc muốn xóa câu này?"
                                                )
                                            )
                                                deleteQuestion(q.id);
                                        }}
                                        className="text-gray-600 hover:text-red-400 self-start p-2 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
