import "./styles.scss";
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { OptionType, QuestionType } from "../../../types/survey";
/* eslint-enable @typescript-eslint/no-unused-vars */
import ButtonAddAnswer from "../../molecules/buttons/ButtonAddAnswer";
import Answer from "../../molecules/answer/Answer";
import { answerDefault } from "../../../constants/question";
import { useEffect } from "react";

type Props = {
    question: QuestionType;
    handleUpdateQuestion: (
        key: keyof QuestionType,
        value:
            | string
            | number
            | boolean
            | OptionType[]
            | Record<string, string | number>
    ) => void;
};

const MultipleChoice = ({ question, handleUpdateQuestion }: Props) => {
    useEffect(() => {
        if (!question?.options?.length) {
            handleUpdateQuestion("options", [{ ...answerDefault, order: 1 }]);
        }
    }, [question]);

    const handleUpdateOption = (updatedOption: OptionType) => {
        const updatedOptions = question.options.map((option) =>
            option.order === updatedOption.order ? updatedOption : option
        );
        handleUpdateQuestion("options", updatedOptions);
    };

    const handleDeleteOption = (orderToDelete: number) => {
        const updatedOptions = question.options.filter(
            (option) => option.order !== orderToDelete
        );
        handleUpdateQuestion("options", updatedOptions);
    };

    const handleAddAnswer = () => {
        const newOrder =
            question.options.length > 0
                ? Math.max(...question.options.map((o) => o.order)) + 1
                : 1;
        const newOption = { ...answerDefault, order: newOrder };
        const updatedOptions = [...question.options, newOption];
        handleUpdateQuestion("options", updatedOptions);
    };

    return (
        <div className="multiple-choice flex flex-col gap-2">
            {question?.options?.length
                ? question.options.map((item) => {
                      return (
                          <Answer
                              data={item}
                              key={item.order}
                              handleUpdateOption={handleUpdateOption}
                              handleDeleteOption={handleDeleteOption}
                              isDisableClose={false}
                              formData={{
                                  Id: 0,
                                  RequesterId: 0,
                                  Title: "",
                                  Description: "",
                                  MarketSurveyVersionStatusId: 1,
                                  SurveyTypeId: 0,
                                  SurveyTopicId: 0,
                                  SurveySpecificTopicId: 0,
                                  SurveyStatusId: 0,
                                  SecurityModeId: 0,
                                  Background: "",
                                  ConfigJson: {
                                      BackgroundGradient1Color: "",
                                      BackgroundGradient2Color: "",
                                      TitleColor: "",
                                      ContentColor: "",
                                      ButtonBackgroundColor: "",
                                      ButtonContentColor: "",
                                      Password: "",
                                      Brightness: 0,
                                  },
                                  SkipStartPage: false,
                              }}
                          />
                      );
                  })
                : null}
            <ButtonAddAnswer onClick={handleAddAnswer} />
        </div>
    );
};

export default MultipleChoice;
