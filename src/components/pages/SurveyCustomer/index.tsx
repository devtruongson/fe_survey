import {  useEffect, useMemo, useState } from "react";
import TurnstileWidget from "../../../hooks/useRecapcha";
import useBlocker from "../../../hooks/useBlocker";
import { useParams } from "react-router-dom";
import { useGetSurvey } from "../../../services/survey/get";

function SurveyCustomer() {
    const [isVerified, setIsVerified] = useState(false);
    const [isRefetch, setIsRefetch] = useState(false);
    const [dataResponse, setDataResponse] = useState<SurveyType | null>(null);
    
    useBlocker(true)

    const {id} = useParams();

    const { data } = useGetSurvey({ id: Number(id) || 0 });

    useEffect(() => {
        if(data) {
            setDataResponse(data.data);
        }
    }, [data])

    if(!dataResponse) return null

    return <div>
           <TurnstileWidget isVerified={isVerified} setIsVerified={setIsVerified} isRefetch={isRefetch} />
            <div 
                className={`fixed top-0 left-0 w-full h-full bg-white z-50`}
                style={{
                    ...(dataResponse?.IsUseBackgroundImageBase64 ? {
                        backgroundImage: `url(${dataResponse.BackgroundImageBase64})`,
                    } : {
                        backgroundColor: dataResponse.BackgroundColor,
                    }),
                    backgroundImage: `url(${dataResponse.BackgroundImageBase64})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",

                }}
            >


            </div>
        </div>;
}

export default SurveyCustomer;