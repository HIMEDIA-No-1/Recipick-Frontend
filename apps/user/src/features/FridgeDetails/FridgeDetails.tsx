import FridgeBoards from "./FridgeBoards.tsx";
import FridgePantry from "./FridgePantry.tsx";
import FridgeFreezer from "./FridgeFreezer.tsx";
import FridgeRefrigerator from "./FridgeRefrigerator.tsx";

const FridgeDetails = () => {
    return (
        <div className={"flex flex-row justify-center"}>
            <div className={"boardAndPantry w-[460px]"}>
                <FridgeBoards />
                <FridgePantry />
            </div>
            <div className="freezerAndFridge w-[460px]">
                <FridgeFreezer />
                <FridgeRefrigerator />
            </div>
        </div>
    );
}

export default FridgeDetails;