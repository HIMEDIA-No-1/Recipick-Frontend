import { FavoritesIcon, SettingsIcon } from "../FridgeButtons.tsx";
import { useFridgeStore } from "../FridgeStores/fridgeStore.tsx";

interface FridgeObjectProps {
    fridgeId: string;
    fridgeName?: string;
}

const FridgeObject = ({ fridgeId, fridgeName = "냉장고 이름" }: FridgeObjectProps) => {
    const { favorites, toggleFavorite } = useFridgeStore();

    const isFav = favorites[fridgeId] || false;

    return (
        <div className="single_fridge_wrap w-[400px] h-[350px] bg-yellow-50 m-5 p-2 rounded inline-block cursor-grab hover:shadow-lg transition-shadow">
            <div className="fridge_setting m-2.5 justify-items-end">
                <SettingsIcon />
            </div>
            <div className="fridge_name text-green-900 text-4xl font-bold m-7">
                <span>{fridgeName}</span>
            </div>
            <div
                onClick={() => toggleFavorite(fridgeId)}
                className="fridge_fav justify-items-end pr-5 pt-32"
            >
                <FavoritesIcon isFav={isFav} />
            </div>
        </div>
    );
};

export default FridgeObject;
