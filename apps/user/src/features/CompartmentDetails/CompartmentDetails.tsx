import {NameEditButton} from "../FridgeButtons.tsx";
import IngredientListExample from "./IngredientsList.tsx";
import CategoryButtons from "./CategoryList.tsx";

const CompartmentDetails = () => {
    return (
        <>
            <div className={"compartment_details_wrapper size-[900px] bg-sky-300 mx-auto border-gray-50 border-4 rounded-xl p-3"}>
                <div className={"compartment_info text-center pt-3"}>
                    <span className={"compartment_name text-3xl font-extrabold"}>예를들어 냉장칸</span>
                    <NameEditButton /><br />
                    <CategoryButtons />
                </div>
                <div className={"compartment_contents"}>
                    <IngredientListExample />
                </div>
            </div>
            <div className={"compartment_waste_bin size-100"}>

            </div>
        </>
    );
}
export default CompartmentDetails;