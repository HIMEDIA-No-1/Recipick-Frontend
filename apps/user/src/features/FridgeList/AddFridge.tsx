import { useState } from "react";

interface AddFridgeProps {
    onAdd: (name: string) => void;
}

export const AddFridge: React.FC<AddFridgeProps> = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = () => {
        if (!name.trim()) return;
        onAdd(name.trim());   // 부모에게 새로운 냉장고 추가 요청
        setName("");
        setIsOpen(false);
    };

    return (
        <div className="add_fridge text-right mt-3">
            {/* 버튼 */}
            <span
                className="text-2xl font-bold m-10 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                + 냉장고 추가하기
            </span>

            {/* 모달 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                    onClick={() => setIsOpen(false)} // 바깥 클릭 시 닫기
                >
                    <form
                        className="bg-white p-6 rounded-2xl shadow-lg w-80"
                        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 버블 방지
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <h2 className="text-xl font-semibold mb-4 text-left">새 냉장고 이름</h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border rounded mb-4 focus:outline-none"
                            placeholder="예: 우리집 냉장고"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                className="px-4 py-2 rounded bg-gray-300"
                                onClick={() => setIsOpen(false)}
                            >
                                취소
                            </button>
                            <button
                                type="submit" // 엔터로도 submit 가능
                                className="px-4 py-2 rounded bg-blue-500 text-white"
                            >
                                추가
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
