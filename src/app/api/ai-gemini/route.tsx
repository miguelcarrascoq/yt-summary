import { CONST_COMPRESS_RESPONSE, CONST_GOOGLE_API_KEY, CONST_PROMPT_CHARS_LENGTH, CONST_USE_USER_API_KEY } from '@/app/services/constants';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers'
import { compress, decompress } from 'lz-string'

export async function POST(request: NextRequest) {
    const headersList = headers();
    const userApiKey = headersList.get("X-User-Api-Key");

    const data = await request.json();
    const inputPrompt = CONST_COMPRESS_RESPONSE ? decompress(data['prompt']) : data['prompt'];
    const inputSummaryLength = data['summaryLength'] ?? 'ultra-short';
    const inputLang = data['lang'] ?? 'es';

    if (!inputPrompt) {
        return NextResponse.json({
            status: false,
            message: 'Prompt is required'
        });
    }

    try {
        const apiKey = CONST_USE_USER_API_KEY ? userApiKey : CONST_GOOGLE_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey ?? '');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let extensionMin;
        let extensionMax;

        let hasBullets = false;
        let bulletCount = 3;

        switch (inputSummaryLength) {
            case 'ultra-short':
                extensionMin = 10;
                extensionMax = 20;
                break;
            case 'short':
                extensionMin = 30
                extensionMax = 50;
                break;
            case 'normal':
                extensionMin = 60;
                extensionMax = 100;
                break;
            case '3-bullets':
                hasBullets = true;
                break;
            case '5-bullets':
                hasBullets = true;
                bulletCount = 5;
                break;
            default:
                extensionMin = 20;
                extensionMax = 50;
                break;
        }

        let language;
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

        let prompt;
        if (!hasBullets) {
            prompt = `Escribe un resumen de la siguiente conversación: ${inputPrompt}. Debido a que este texto generado será leido por un text-to-speech debe ser lo mas claro posible. La cantidad de palabras tiene que tener entre ${extensionMin} y ${extensionMax} palabras (no puede superar las ${extensionMax} palabras). Tu resumen debe estar en el idioma ${language}. Si hay caracteres especiales, renderiza el texto en HTML. Colocar en negrita frases importantes (<b>)`;
        } else {
            prompt = `Escribe un resumen de la siguiente conversación: ${inputPrompt}. Debido a que este texto generado será leido por un text-to-speech debe ser lo mas claro posible. Debe destacar los ${bulletCount} principales conceptos (renderizar con lista numerada en HTML <ol><li>). Tu resumen debe estar en el idioma ${language}. Si hay caracteres especiales, renderiza el texto en HTML. Colocar en negrita frases importantes (<b>)`;
        }

        if (prompt.length > CONST_PROMPT_CHARS_LENGTH) {
            return NextResponse.json({
                status: false,
                message: `Prompt is too long. Allowed ${CONST_PROMPT_CHARS_LENGTH}, got ${prompt.length}`
            });
        }

        const result = await model.generateContent([prompt]);

        return NextResponse.json({
            status: true,
            transcript: CONST_COMPRESS_RESPONSE ? compress(result.response.text()) : result.response.text()
        });
    } catch (error) {
        return NextResponse.json({
            status: false,
            message: `Failed to fetch transcript data: ${error}`
        });
    }

}