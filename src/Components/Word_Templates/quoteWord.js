import React from 'react';
import { Document, ImageRun, Packer, Paragraph, TextRun } from 'docx';
import * as fs from 'fs';

const header = "https://i.ibb.co/0snCVqq/header.png";
const docx = require("docx");
const {format } = require('date-fns-tz');
let formatDate = format(new Date(), "yyyy-MM-dd");

export default async function QuoteToWord(info) {
    const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children:[
                            new ImageRun({
                                data:fs.readFileSync(header),
                                transformation:{
                                    width:500,
                                    height:100
                                }
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Attention:",
                                bold: true,
                            }),
                            new TextRun({
                                text: info.first_name + " " + info.last_name
                            }),
                            new TextRun({
                                text:"Address:",
                                break:1
                            }),
                            new TextRun({
                                text:info.billing_address
                            }),
                            new TextRun({
                                text:"City:",
                                break:1
                            }),
                            new TextRun({
                                text:info.city
                            }),
                            new TextRun({
                                text:"Postal Code:",
                                break:1
                            }),
                            new TextRun({
                                text:info.post_code
                            }),
                            new TextRun({
                                text:"Phone:",
                                break:1
                            }),
                            new TextRun({
                                text:info.phone_number
                            }),
                            new TextRun({
                                text:"Email:",
                                break:1
                            }),
                            new TextRun({
                                text:info.email
                            }),
                        ],
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text:"Site Information",
                                bold:true
                            }),
                            new TextRun({
                                text:"Site Address:",
                                break:1
                            }),
                            new TextRun({
                                text:info.site_address
                            }),
                            new TextRun({
                                text:"Site City:",
                                break:1
                            }),
                            new TextRun({
                                text:info.site_city
                            }),
                            new TextRun({
                                text:"Site Province",
                                break:1
                            }),
                            new TextRun({
                                text:info.site_prov
                            }),
                            new TextRun({
                                text:"Site Postal Code:",
                                break:1
                            }),
                            new TextRun({
                                text:info.site_postal
                            }),
                        ],
                    })
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${info.first_name}_${info.last_name}_${formatDate}.docx`;
    link.click();
    return (
        null
    );
}