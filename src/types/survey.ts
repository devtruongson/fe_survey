export type OptionType = {
    content: string;
    order: number;
    image?: string; // base64 image data
};

export type SlideType = {
    min: number;
    max: number;
    step: number;
    unit: string;
};

export type JumpLogicsType = {
    conditions: {
        questionOrder: number;
        conjunction: string;
        operator: string;
        compareValue: number;
    }[];
    targetQuestionOrder: number;
};
export type QuestionType = {
    image_header?: string;
    questionTypeId: number;
    content: string;
    description: string;
    timeLimit: number;
    isVoice: boolean;
    order: number;
    ConfigJson: Record<string, string | number | SlideType[] | JumpLogicsType[]>;
    options: OptionType[];
};

export type SurveyType = {
    Id: number;
    RequesterId: number;
    Title: string;
    Description: string;
    MarketSurveyVersionStatusId: number | null;
    SurveyTypeId: number;
    SurveyTopicId: number;
    SurveySpecificTopicId: number;
    SurveyStatusId: number;
    SecurityModeId: number;
    Background: string;
    MainImageBase64?: string;
    BackgroundImageBase64: string;
    IsUseBackgroundImageBase64: boolean;
    CustomBackgroundImageUrl?: string | null;
    ConfigJson: {
        DefaultBackgroundImageId: number;
        BackgroundGradient1Color: string;
        BackgroundGradient2Color: string;
        TitleColor: string;
        ContentColor: string;
        ButtonBackgroundColor: string;
        ButtonContentColor: string;
        Password: string | null;
        Brightness: number;
        IsResizableIframeEnabled?: boolean;
    };
    Questions: QuestionType[];
    SkipStartPage: boolean;
};

export interface PageProps {
    isDisable: boolean;
    formData: SurveyType;
    setFormData: React.Dispatch<React.SetStateAction<SurveyType>>;
    handleTabClick: (tabValue: number) => void;
    isTrigger: boolean;
}
