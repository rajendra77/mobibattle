import React from "react";
import Image from "../commonComponents/Image";
import Text from "../commonComponents/Text";

function SubscriptionFeature({image, feature, lang, id}) {
    return(
        <div className="flex my-1 w-full items-center">
            <Image url={image} styles={"mr-4 h-8 " + (id === 3 ? " w-12" : " w-8")} />
            <Text 
                tag="h5"
                text={feature[lang]}
                textColor="text-white"
                styles="capitalize font-medium opacity-85 ml-1 mr-3"
            />
        </div>
    )
}

export default SubscriptionFeature;