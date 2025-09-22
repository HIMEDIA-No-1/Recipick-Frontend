import { useState, useRef, useEffect, useCallback } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "react-beautiful-dnd";
import FridgeObject from "./FridgeObject.tsx";
import { AddFridge } from "./AddFridge.tsx";
import { debounce } from "lodash-es";

// 냉장고 타입 정의
interface Fridge {
    id: string;
    name: string;
}

// 냉장고 그룹 타입 정의
type FridgeGroup = Fridge[];

const FridgeList: React.FC = () => {
    const carouselRef = useRef<HTMLDivElement>(null);

    // 초기 냉장고 데이터
    const initialFridges: Fridge[] = [
        { id: "fridge-1", name: "냉장고 1" },
        { id: "fridge-2", name: "냉장고 2" },
        { id: "fridge-3", name: "냉장고 3" },
    ];

    const [fridgeList, setFridgeList] = useState<Fridge[]>(initialFridges);

    // ----------------------------
    // 서버 저장 함수
    // ----------------------------
    const saveFridgeOrderToServer = async (orderIds: string[]) => {
        try {
            await fetch("/api/save-fridge-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ order: orderIds }),
            });
            console.log("서버에 냉장고 순서 저장 성공:", orderIds);
        } catch (error) {
            console.error("서버 저장 실패:", error);
        }
    };

    // 디바운스된 저장 함수 (3초 뒤 실행)
    const debouncedSave = useCallback(
        debounce((orderIds: string[]) => {
            saveFridgeOrderToServer(orderIds);
        }, 3000),
        []
    );

    // ----------------------------
    // 컴포넌트 마운트 시 localStorage에서 불러오기
    // ----------------------------
    useEffect(() => {
        const savedOrder = localStorage.getItem("fridgeOrder");
        if (savedOrder) {
            try {
                const parsedOrder: string[] = JSON.parse(savedOrder);
                const reorderedFridges = parsedOrder
                    .map((id: string) => initialFridges.find((f) => f.id === id))
                    .filter((f): f is Fridge => f !== undefined);

                const newFridges = initialFridges.filter((f) => !parsedOrder.includes(f.id));

                setFridgeList([...reorderedFridges, ...newFridges]);
            } catch (error) {
                console.error("냉장고 순서 불러오기 실패:", error);
                setFridgeList(initialFridges);
            }
        }
    }, []);

    // ----------------------------
    // 변경된 순서 저장 (로컬 + 서버)
    // ----------------------------
    const persistOrder = (fridges: Fridge[]) => {
        const orderIds = fridges.map((f) => f.id);
        // localStorage에는 즉시 반영
        localStorage.setItem("fridgeOrder", JSON.stringify(orderIds));
        // 서버에는 디바운스 적용
        debouncedSave(orderIds);
    };

    // ----------------------------
    // 드래그 종료 시 실행
    // ----------------------------
    const onDragEnd = (result: DropResult): void => {
        if (!result?.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        const newFridgeList = [...fridgeList];
        const [movedFridge] = newFridgeList.splice(sourceIndex, 1);
        newFridgeList.splice(destinationIndex, 0, movedFridge);

        setFridgeList(newFridgeList);
        persistOrder(newFridgeList);
    };

    // ----------------------------
    // 페이지 종료 시 최종 순서 서버 전송 (sendBeacon)
    // ----------------------------
    useEffect(() => {
        const handleBeforeUnload = () => {
            const orderIds = fridgeList.map((f) => f.id);
            const data = JSON.stringify({ order: orderIds });
            navigator.sendBeacon("/api/save-fridge-order", data);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [fridgeList]);

    // ----------------------------
    // 새로운 냉장고 추가
    // ----------------------------
    const handleAddFridge = (name: string) => {
        const newFridge: Fridge = {
            id: `fridge-${Date.now()}`, // 고유 ID 생성
            name,
        };
        const newList = [...fridgeList, newFridge];
        setFridgeList(newList);
        persistOrder(newList);
    };

    // ----------------------------
    // 캐러셀 스크롤
    // ----------------------------
    const scrollLeft = () => {
        carouselRef.current?.scrollBy({ left: -900, behavior: "smooth" });
    };

    const scrollRight = () => {
        carouselRef.current?.scrollBy({ left: 900, behavior: "smooth" });
    };

    // 4개씩 그룹화 (2x2 그리드)
    const fridgeGroups: FridgeGroup[] = [];
    for (let i = 0; i < fridgeList.length; i += 4) {
        fridgeGroups.push(fridgeList.slice(i, i + 4));
    }

    return (
        <div className="fridge_list_wrap w-4/5 h-4/5 min-w-[500px] min-h-[900px] md:w-[900px] p-2.5 pb-5 bg-gray-400 justify-self-center relative">
            {/* AddFridge 버튼 → 이름 받아서 새 냉장고 추가 */}
            <AddFridge onAdd={handleAddFridge} />

            {fridgeList.length > 4 && (
                <button
                    type="button"
                    className="absolute left-2 top-[440px] -translate-y-1/2 p-2 bg-transparent rounded-full z-20 text-gray-700 font-bold"
                    onClick={scrollLeft}
                    aria-label="이전 냉장고 그룹 보기"
                >
                    ◀
                </button>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="fridge-list">
                    {(provided) => (
                        <div
                            ref={carouselRef}
                            className="draggable-fridge-container overflow-x-auto scrollbar-hide scroll-smooth"
                            {...provided.droppableProps}
                        >
                            <div ref={provided.innerRef} className="flex gap-4">
                                {fridgeGroups.map((group, groupIndex) => (
                                    <div
                                        key={`group-${groupIndex}`}
                                        className="flex-shrink-0 grid grid-cols-2 gap-4 w-[850px]"
                                    >
                                        {group.map((fridge, indexInGroup) => {
                                            const overallIndex = groupIndex * 4 + indexInGroup;
                                            return (
                                                <Draggable key={fridge.id} draggableId={fridge.id} index={overallIndex}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`${
                                                                snapshot.isDragging
                                                                    ? "opacity-70 z-50 transform rotate-3 scale-105"
                                                                    : "transform-none"
                                                            } transition-transform duration-200`}
                                                        >
                                                            <FridgeObject fridgeName={fridge.name} fridgeId={fridge.id} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                    </div>
                                ))}
                                {provided.placeholder}
                            </div>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {fridgeList.length > 4 && (
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-transparent rounded-full z-20 text-gray-700 font-bold"
                    onClick={scrollRight}
                    aria-label="다음 냉장고 그룹 보기"
                >
                    ▶
                </button>
            )}
        </div>
    );
};

export default FridgeList;
