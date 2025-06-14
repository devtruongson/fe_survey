/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    FreeBreakfast,
    Timer,
    VolumeUp
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardMedia,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    LinearProgress,
    Paper,
    Radio,
    RadioGroup,
    Rating,
    Slider,
    Typography
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSurvey } from '../../../services/survey/get';

// Type definitions
interface SurveyConfig {
    BackgroundGradient1Color: string;
    BackgroundGradient2Color: string;
    TitleColor: string;
    ContentColor: string;
    ButtonBackgroundColor: string;
    ButtonContentColor: string;
    Password?: string;
    Brightness: number;
}

interface QuestionOption {
    content: string;
    order: number;
}

interface JumpLogicCondition {
    questionOrder: number;
    conjunction: string | null;
    operator: string;
    optionOrder: number;
    compareValue: number;
}

interface JumpLogic {
    conditions: JumpLogicCondition[];
    targetQuestionOrder: number;
}

interface DisplayLogic {
    conditions: JumpLogicCondition[];
    targetQuestionOrder: number;
}

interface MatrixDataItem {
    label?: string;
    min: number;
    max: number;
    step: number;
    unit: string;
}

interface QuestionConfig {
    image_end_question?: boolean;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    data?: MatrixDataItem[];
    ratingIcon?: string;
    ratingLength?: number;
    required_answer?: boolean;
    is_auto_view_show?: boolean;
    jumpLogics?: JumpLogic[];
    displayLogics?: DisplayLogic[];
}

interface Question {
    questionTypeId: number;
    content: string;
    description: string;
    timeLimit: number;
    isVoice: boolean;
    order: number;
    ConfigJson: QuestionConfig;
    options: QuestionOption[];
    image_header?: string;
}

interface SurveyData {
    Id: number;
    RequesterId: number;
    Title: string;
    Description: string;
    SurveyTypeId: number;
    SurveyTopicId: number;
    SurveySpecificTopicId: number;
    SurveyStatusId: number;
    SecurityModeId: number;
    Background: string;
    ConfigJson: SurveyConfig;
    Questions: Question[];
    SkipStartPage: boolean;
    CustomBackgroundImageUrl: string | null;
}


interface AnswerState {
    [key: string]: any;
}

const SurveyPreview: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [answers, setAnswers] = useState<AnswerState>({});

    const { id } = useParams();

    const { data } = useGetSurvey({ id: Number(id) || 0 });

    const surveyData: SurveyData | undefined = useMemo(() => data?.data, [data]);

    if (!surveyData) {
        return (
            <Box sx={{ textAlign: 'center', mt: 5 }}>
                <Typography variant="h6" color="text.secondary">
                    Đang tải dữ liệu khảo sát...
                </Typography>
            </Box>
        );
    }

    const getQuestionTypeName = (typeId: number): string => {
        const types: Record<number, string> = {
            1: 'Chọn 1 đáp án',
            2: 'Chọn nhiều đáp án',
            3: 'Thang điểm',
            4: 'Ma trận đánh giá',
            5: 'Văn bản',
            6: 'Đánh giá sao'
        };
        return types[typeId] || 'Không xác định';
    };

    const handleAnswerChange = (questionOrder: number | any, value: any): void => {
        setAnswers(prev => ({
            ...prev,
            [questionOrder]: value
        }));
    };

    const handleMultipleChoiceChange = (
        questionOrder: number,
        optionContent: string,
        checked: boolean
    ): void => {
        const currentAnswers = answers[questionOrder] as string[] || [];
        if (checked) {
            handleAnswerChange(questionOrder, [...currentAnswers, optionContent]);
        } else {
            handleAnswerChange(questionOrder, currentAnswers.filter(a => a !== optionContent));
        }
    };

    const renderQuestion = (question: Question | any, index: number) => {
        const isActive = index === currentQuestion;

        return (
            <Card
                key={question.order}
                sx={{
                    mb: 2,
                    opacity: isActive ? 1 : 0.7,
                    transform: isActive ? 'scale(1)' : 'scale(0.98)',
                    transition: 'all 0.3s ease',
                    border: isActive ? '2px solid #FCBC72' : '1px solid #e0e0e0'
                }}
            >
                {question.image_header && (
                    <CardMedia
                        component="img"
                        height="200"
                        image={question.image_header}
                        alt="Question header"
                    />
                )}

                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip
                            label={getQuestionTypeName(question.questionTypeId)}
                            size="small"
                            sx={{ mr: 1, bgcolor: '#FCBC72', color: 'white' }}
                        />
                        <Chip
                            label={`Câu ${question.order}`}
                            size="small"
                            variant="outlined"
                            sx={{ mr: 1 }}
                        />
                        {question.isVoice && (
                            <Chip
                                icon={<VolumeUp />}
                                label="Có âm thanh"
                                size="small"
                                color="primary"
                                sx={{ mr: 1 }}
                            />
                        )}
                        {question.timeLimit > 0 && (
                            <Chip
                                icon={<Timer />}
                                label={`${question.timeLimit}s`}
                                size="small"
                                color="warning"
                            />
                        )}
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            color: surveyData.ConfigJson.TitleColor,
                            mb: 1,
                            fontWeight: 600
                        }}
                    >
                        {question.content || `Câu hỏi ${question.order}`}
                    </Typography>

                    {question.description && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: surveyData.ConfigJson.ContentColor,
                                mb: 2,
                                fontStyle: 'italic'
                            }}
                        >
                            {question.description}
                        </Typography>
                    )}

                    {/* Single Choice (Radio) */}
                    {question.questionTypeId === 1 && (
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={answers[question.order] as string || ''}
                                onChange={(e) => handleAnswerChange(question.order, e.target.value)}
                            >
                                {question.options.map((option: QuestionOption) => (
                                    <FormControlLabel
                                        key={option.order}
                                        value={option.content}
                                        control={<Radio sx={{ color: '#FCBC72' }} />}
                                        label={option.content}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}

                    {/* Multiple Choice (Checkbox) */}
                    {question.questionTypeId === 2 && (
                        <FormGroup>
                            {question.options.map((option: QuestionOption) => (
                                <FormControlLabel
                                    key={option.order}
                                    control={
                                        <Checkbox
                                            sx={{ color: '#FCBC72' }}
                                            onChange={(e) => handleMultipleChoiceChange(
                                                question.order,
                                                option.content,
                                                e.target.checked
                                            )}
                                        />
                                    }
                                    label={option.content}
                                />
                            ))}
                        </FormGroup>
                    )}

                    {/* Slider Scale */}
                    {question.questionTypeId === 3 && (
                        <Box sx={{ mt: 2 }}>
                            <Typography gutterBottom>
                                Giá trị: {(answers[question.order] as number) || question.ConfigJson.min || 0} {question.ConfigJson.unit || ''}
                            </Typography>
                            <Slider
                                value={(answers[question.order] as number) || question.ConfigJson.min || 0}
                                onChange={(_, value) => handleAnswerChange(question.order, value)}
                                min={question.ConfigJson.min || 0}
                                max={question.ConfigJson.max || 10}
                                step={question.ConfigJson.step || 1}
                                marks
                                valueLabelDisplay="auto"
                                sx={{ color: '#FCBC72' }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="caption">{question.ConfigJson.min || 0}</Typography>
                                <Typography variant="caption">{question.ConfigJson.max || 10}</Typography>
                            </Box>
                        </Box>
                    )}

                    {/* Matrix Rating */}
                    {question.questionTypeId === 4 && (
                        <Box>
                            {question.ConfigJson.data?.map((item: MatrixDataItem, idx: number) => (
                                <Box key={idx} sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                        {item.label || `Tiêu chí ${idx + 1}`}
                                    </Typography>
                                    <Slider
                                        value={(answers[`${question.order}_${idx}`] as number) || item.min}
                                        onChange={(_, value) => handleAnswerChange(`${(question).order}_${idx}`, value)}
                                        min={item.min}
                                        max={item.max}
                                        step={item.step}
                                        marks
                                        valueLabelDisplay="auto"
                                        sx={{ color: '#FCBC72' }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="caption">{item.min}</Typography>
                                        <Typography variant="caption">{item.max}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Star Rating */}
                    {question.questionTypeId === 6 && (
                        <Box sx={{ mt: 2 }}>
                            <Rating
                                value={(answers[question.order] as number) || 0}
                                onChange={(_, value) => handleAnswerChange(question.order, value)}
                                max={question.ConfigJson.ratingLength || 5}
                                icon={<FreeBreakfast fontSize="inherit" />}
                                emptyIcon={<FreeBreakfast fontSize="inherit" />}
                                sx={{ color: '#FCBC72' }}
                            />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                {(answers[question.order] as number) || 0} / {question.ConfigJson.ratingLength || 5}
                            </Typography>
                        </Box>
                    )}

                    {/* Jump Logic Info */}
                    {question.ConfigJson.jumpLogics && question.ConfigJson.jumpLogics.length > 0 && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                <strong>Logic nhảy:</strong> Có điều kiện chuyển câu hỏi ({question.ConfigJson.jumpLogics.length} điều kiện)
                            </Typography>
                        </Box>
                    )}

                    {/* Display Logic Info */}
                    {question.ConfigJson.displayLogics && question.ConfigJson.displayLogics.length > 0 && (
                        <Box sx={{ mt: 1, p: 2, bgcolor: '#f0f8ff', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                <strong>Logic hiển thị:</strong> Có điều kiện hiển thị ({question.ConfigJson.displayLogics.length} điều kiện)
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Card>
        );
    };

    const handlePreviousQuestion = (): void => {
        setCurrentQuestion(prev => Math.max(0, prev - 1));
    };

    const handleNextQuestion = (): void => {
        setCurrentQuestion(prev => Math.min(surveyData.Questions.length - 1, prev + 1));
    };

    const progressPercentage = ((currentQuestion + 1) / surveyData.Questions.length) * 100;
    const isLastQuestion = currentQuestion === surveyData.Questions.length - 1;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${surveyData.ConfigJson.BackgroundGradient1Color} 0%, ${surveyData.ConfigJson.BackgroundGradient2Color} 100%)`,
                p: 3
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 800,
                    mx: 'auto',
                    p: 4,
                    borderRadius: 3
                }}
            >
                {/* Survey Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: surveyData.ConfigJson.TitleColor,
                            fontWeight: 'bold',
                            mb: 2
                        }}
                    >
                        {surveyData.Title || 'Khảo sát không có tiêu đề'}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: surveyData.ConfigJson.ContentColor,
                            mb: 3
                        }}
                    >
                        {surveyData.Description || 'Không có mô tả'}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
                        <Chip label={`ID: ${surveyData.Id}`} size="small" />
                        <Chip label={`Loại: ${surveyData.SurveyTypeId}`} size="small" />
                        <Chip label={`Chủ đề: ${surveyData.SurveyTopicId}`} size="small" />
                        <Chip label={`Trạng thái: ${surveyData.SurveyStatusId}`} size="small" />
                        <Chip label={`Bảo mật: ${surveyData.SecurityModeId}`} size="small" />
                    </Box>

                    <LinearProgress
                        variant="determinate"
                        value={progressPercentage}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: surveyData.ConfigJson.ButtonBackgroundColor
                            }
                        }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Câu hỏi {currentQuestion + 1} / {surveyData.Questions.length}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                {/* Questions */}
                {surveyData.Questions.map((question: Question, index: number) =>
                    renderQuestion(question, index)
                )}

                {/* Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        variant="outlined"
                        disabled={currentQuestion === 0}
                        onClick={handlePreviousQuestion}
                        sx={{
                            borderColor: surveyData.ConfigJson.ButtonBackgroundColor,
                            color: surveyData.ConfigJson.ButtonBackgroundColor
                        }}
                    >
                        Câu trước
                    </Button>

                    <Button
                        variant="contained"
                        disabled={isLastQuestion}
                        onClick={handleNextQuestion}
                        sx={{
                            bgcolor: surveyData.ConfigJson.ButtonBackgroundColor,
                            color: surveyData.ConfigJson.ButtonContentColor,
                            '&:hover': {
                                bgcolor: '#e6a862'
                            }
                        }}
                    >
                        {isLastQuestion ? 'Hoàn thành' : 'Câu tiếp theo'}
                    </Button>
                </Box>

                {/* Survey Config Info */}
                <Box sx={{ mt: 4, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Cấu hình khảo sát:</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                        <Typography variant="body2">
                            <strong>Màu tiêu đề:</strong> {surveyData.ConfigJson.TitleColor}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Màu nội dung:</strong> {surveyData.ConfigJson.ContentColor}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Màu nút:</strong> {surveyData.ConfigJson.ButtonBackgroundColor}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Độ sáng:</strong> {surveyData.ConfigJson.Brightness}%
                        </Typography>
                        <Typography variant="body2">
                            <strong>Bỏ qua trang bắt đầu:</strong> {surveyData.SkipStartPage ? 'Có' : 'Không'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Mật khẩu:</strong> {surveyData.ConfigJson.Password ? '******' : 'Không có'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default SurveyPreview;