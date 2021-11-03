import React from 'react';
import { Document, ImageRun, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from 'docx';

const header = "https://i.ibb.co/0snCVqq/header.png";
const footer = 'https://i.ibb.co/tm6mdt0/footer.png';
const docx = require("docx");
const {format } = require('date-fns-tz');
let formatDate = format(new Date(), "yyyy_MM_dd");



let renderDetails = (info) => {
    let rowArray = [];
    info.details.map((item) => {
        let newRow = new TableRow({
            width:{
                size:8000
            },
            children:[
                new TableCell({
                    width:{
                        size:8000
                    },
                    children:[
                        new Paragraph({
                             text:item.details
                        })
                    ]
                   
                })
            ]
        });
        let newProdTable = new TableRow({
            width:{
                size:8000
            },
            children:[
                new TableCell({
                    children:[
                        new Table({
                            rows:renderProds(item.productArr)
                        }),
                        new Paragraph({
                            text:`Detail Total: ${item.total}`
                        })
                    ]
                })
            ]
            
        })
        rowArray.push(newRow);
        rowArray.push(newProdTable);
        return newRow;
    })
    return rowArray;
}

let renderProds = (info) => {
    console.log(info);
    let detailArr = [];
    info.map((item) => {
        let newRow = new TableRow({
            children:[
                new TableCell({
                  children:[
                      new Paragraph({
                          text:item.product
                      })
                  ]  
                }),
                new TableCell({
                    children:[
                        new Paragraph({
                            text:item.notes
                        })
                    ]
                }),
                new TableCell({
                    children:[
                        new Paragraph({
                            text:item.price
                        })
                    ]  
                })
            ]
    });
    detailArr.push(newRow);
    return newRow;
    })
    console.log(info);
    return detailArr;
}

export default async function QuoteToWord(info) {
    const head = await fetch(
        "https://i.ibb.co/0snCVqq/header.png"
    ).then(r => r.blob());
    const foot = await fetch(
        'https://i.ibb.co/tm6mdt0/footer.png'
    ).then(r => r.blob());

    const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children:[
                            new ImageRun({
                                data:head,
                                transformation:{
                                    width:600,
                                    height:125
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
                    }),
                    new Table({
                        width:{
                            size:8000
                        },
                        rows:[
                            new TableRow({
                                children:[
                                    new TableCell({
                                        width:{
                                            size:8000
                                        },
                                        children:[
                                            new Paragraph({
                                                text:"Quote Details"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    new Table({
                        rows: renderDetails(info)
                    }),
                    new Paragraph({
                        text:`Quote total: ${info.total}`
                    }),
                    new Paragraph({
                        break:2
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text:"Customer Notes: ",
                                break:1
                            }),
                            new TextRun({
                                text:info.customer_notes
                            })
                        ]
                    }),
                    new Paragraph({
                        children:[
                            new TextRun({
                                text:`PLEASE BE AWARE THAT POLYURETHANE SPRAY FOAM INSULATION REQUIRES A THERMAL BARRIER I.E. DRYWALL, OR FIREPROOFING. ¼ INCH TOLERANCE DURING APPLICATION IS REQUIRED.`,
                                break:2,
                                size:13
                            }),
                            new TextRun({
                                text:`PAYMENT UPON COMPLETION OF WORK IS REQUIRED IN FULL BY CASH, CHEQUE, VISA, MASTERCARD, OR AMERICAN EXPRESS. REITZEL INSULATION DOES NOT GIVE TERMS UNLESS PRE-AUTHORIZED PRIOR TO PROJECT START DATE.`,
                                break:1,
                                size:13
                            }),
                            new ImageRun({
                                data:foot,
                                transformation:{
                                    width:600,
                                    height:80
                                }
                            })
                        ]
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