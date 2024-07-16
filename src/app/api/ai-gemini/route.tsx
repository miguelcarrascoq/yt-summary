import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const data = await request.json();
    const inputPrompt = data['prompt']
    const inputSummaryLength = data['summaryLength'] ?? 'ultra-short';
    const inputLang = data['lang'] ?? 'es';
    if (!inputPrompt) {
        return NextResponse.json({
            status: false,
            text: 'Prompt is required'
        });
    }
    try {

        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let extensionMin = 0;
        let extensionMax = 100;

        switch (inputSummaryLength) {
            case 'ultra-short':
                extensionMin = 10;
                extensionMax = 20;
                break;
            case 'short':
                extensionMin = 20
                extensionMax = 50;
                break;
            case 'normal':
                extensionMin = 50;
                extensionMax = 100;
                break;
            default:
                extensionMin = 20;
                extensionMax = 50;
                break;
        }

        let language = 'español';
        switch (inputLang) {
            case 'es':
                language = 'español';
                break;
            case 'en':
                language = 'inglés';
                break;
            default:
                language = 'español';
                break;
        }

        const prompt = `Escribe un resumen de la siguiente conversación: ${inputPrompt}. Debido a que este texto generado será leido por un text-to-speech debe ser lo mas claro posible. La cantidad de palabras tiene que tener entre ${extensionMin} y ${extensionMax} palabras. Tu resumen debe estar en el idioma ${language}. Si hay caracteres especiales, renderiza el texto en HTML.`;
        const result = await model.generateContent([prompt]);

        return NextResponse.json({
            status: true,
            transcript: result.response.text()
        });
    } catch (error) {
        return NextResponse.json({
            status: false,
            text: 'Failed to fetch transcript'
        });
    }

}