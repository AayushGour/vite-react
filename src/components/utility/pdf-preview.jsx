import React, { useEffect, useState } from 'react';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts"
import Loader from './loader';
import HelveticaFont from "../../assets/fonts/Helvetica.ttf"
import HelveticaBoldFont from "../../assets/fonts/Helvetica-Bold.ttf"
import HelveticaItalicFont from "../../assets/fonts/Helvetica-Oblique.ttf"
import HelveticaBoldItalicFont from "../../assets/fonts/Helvetica-BoldOblique.ttf"
import KannadaFont from "../../assets/fonts/Kannada-font.ttf"
import TimesNewRomanFont from "../../assets/fonts/TIMES.ttf"
import TimesNewRomanBoldFont from "../../assets/fonts/TIMESBD.ttf"
import { convertImageToBase64 } from './file-convertors';

function PdfPreview({ docDefinition, className }) {

    // Register the fonts with pdfMake


    const [pdfUrl, setPdfUrl] = useState(null);

    const generatePdf = async () => {
        pdfMake.vfs = pdfFonts && pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs;

        const helveticaFont = new URL("../../assets/fonts/Helvetica.ttf", import.meta.url).href;
        const helveticaBoldFont = new URL("../../assets/fonts/Helvetica-Bold.ttf", import.meta.url).href;
        const helveticaItalicFont = new URL("../../assets/fonts/Helvetica-Oblique.ttf", import.meta.url).href;
        const helveticaBoldItalicFont = new URL("../../assets/fonts/Helvetica-BoldOblique.ttf", import.meta.url).href;
        const kannadaFont = new URL("../../assets/fonts/Kannada-font.ttf", import.meta.url).href;
        const timesNewRomanFont = new URL("../../assets/fonts/TIMES.ttf", import.meta.url).href;
        const timesNewRomanBoldFont = new URL("../../assets/fonts/TIMESBD.ttf", import.meta.url).href;

        // pdfMake.vfs["Helvetica.ttf"] = await convertImageToBase64(HelveticaFont)?.then(res => res?.replace("data:font/ttf;base64,", ""));
        // pdfMake.vfs["Helvetica-Bold.ttf"] = await convertImageToBase64(HelveticaBoldFont)?.then(res => res?.replace("data:font/ttf;base64,", ""));
        // pdfMake.vfs["Helvetica-Oblique.ttf"] = await convertImageToBase64(HelveticaItalicFont)?.then(res => res?.replace("data:font/ttf;base64,", ""));
        // pdfMake.vfs["Helvetica-BoldOblique.ttf"] = await convertImageToBase64(HelveticaBoldItalicFont)?.then(res => res?.replace("data:font/ttf;base64,", ""));
        // pdfMake.vfs["Kannada-font.ttf"] = await convertImageToBase64(KannadaFont)?.then(res => res?.replace("data:font/ttf;base64,", ""));
        // pdfMake.vfs["Times-New-Roman.ttf"] = await convertImageToBase64(TimesNewRomanFont)?.then(res => res?.replace("data:font/ttf;base64,", ""));
        // pdfMake.vfs["Times-New-Roman-Bold.ttf"] = await convertImageToBase64(TimesNewRomanBoldFont)?.then(res => res?.replace("data:font/ttf;base64,", ""));

        const docDef = {
            ...docDefinition,
            defaultStyle: {
                font: 'Helvetica',
                lineHeight: 1.2,
            }
        }
        const fonts = {
            ...pdfMake.fonts,
            // Courier: {
            //     normal: 'Courier',
            //     bold: 'Courier-Bold',
            //     italics: 'Courier-Oblique',
            //     bolditalics: 'Courier-BoldOblique'
            // },
            // Helvetica: {
            //     normal: "Helvetica.ttf",
            //     bold: 'Helvetica-Bold.ttf',
            //     italics: 'Helvetica-Oblique.ttf',
            //     bolditalics: 'Helvetica-BoldOblique.ttf'
            // },
            Helvetica: {
                normal: helveticaFont,
                bold: helveticaBoldFont,
                italics: helveticaItalicFont,
                bolditalics: helveticaBoldItalicFont,
            },
            "Kannada-font": {
                normal: kannadaFont,
                bold: kannadaFont,
                italics: kannadaFont,
                bolditalics: kannadaFont,
            },
            "Times-New-Roman": {
                normal: timesNewRomanFont,
                bold: timesNewRomanBoldFont,
                italics: timesNewRomanFont,
                bolditalics: timesNewRomanFont
            },
            // Symbol: {
            //     normal: 'Symbol'
            // },
            // ZapfDingbats: {
            //     normal: 'ZapfDingbats'
            // }
        };

        // pdfMake.vfs["Helvetica"] = await convertImageToBase64(HelveticaFont);
        // pdfMake.vfs["Helvetica"] = await convertImageToBase64(HelveticaFont);
        const pdfDocGenerator = pdfMake.createPdf(docDef, {}, fonts);

        const pdfData = await new Promise((resolve, reject) => {
            pdfDocGenerator.getBase64((data) => {
                resolve(data);
            });
        });

        setPdfUrl(pdfData);
    };

    useEffect(() => {
        generatePdf();
    }, [docDefinition]);

    return (
        <div className={className ?? ""}>
            {pdfUrl ? (
                <embed className='w-100 h-100' src={`data:application/pdf;base64,${pdfUrl}`} />
            ) : (
                <Loader />
            )}
        </div>
    );
}

export default PdfPreview;
