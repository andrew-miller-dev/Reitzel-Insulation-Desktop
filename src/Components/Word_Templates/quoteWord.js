import { Document, ImageRun, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, Header, Footer } from 'docx';

const header = "https://i.ibb.co/0snCVqq/header.png";
const footer = 'https://i.ibb.co/tm6mdt0/footer.png';
const docx = require("docx");
const {format } = require('date-fns-tz');
let formatDate = format(new Date(), "yyyy_MM_dd");



let renderDetails = (info) => {
    let rowArray = [];
    info.details.map((item) => {
        let newRow = new TableRow({
            children:[
                new TableCell({
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
                            columnWidths:[8000,2000],
                            rows:renderProds(item.productArr)
                        }),
                        new Paragraph({
                            text:`Product Total: ${item.total}`
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
    let detailArr = [];
    info.map((item) => {
        let newRow = new TableRow({

            children:[
                new TableCell({
                    width:{
                        size:8000,
                        style:WidthType.DXA
                    },
                    children:[
                      new Paragraph({
                          text:item.product
                      })
                  ]  
                }),
                new TableCell({
                    width:{
                        size:2000,
                        style:WidthType.DXA
                    },
                    children:[
                        new Paragraph({
                            text:item.price.toString()
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
                headers:{
                    default: new Header({
                        children:[
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
                            })
                        ]
                    })
                },
                footers:{
                    default: new Footer({
                        children:[
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
                        ]
                    })
                },
                children: [
                    new Table({
                        indent:{
                            size:-500,
                            type:WidthType.DXA
                        },
                        columnWidths:[5000,5000],
                        borders: {
                            top:{
                                style:BorderStyle.NONE
                            },
                            bottom:{
                                style:BorderStyle.NIL
                            }

                        },
                        rows:[
                            new TableRow({
                                children:[
                                    new TableCell({
                                        borders:{
                                            right:{
                                                style:BorderStyle.NONE
                                            },
                                            left:{
                                                style:BorderStyle.NONE
                                            },
                                            top:{
                                                style:BorderStyle.NONE
                                            },
                                            bottom:{
                                                style:BorderStyle.NONE
                                            }
                                        },
                                        width:{
                                            size:5000,
                                            type:WidthType.DXA
                                        },
                                        children:[
                                            new Paragraph({
                                                children: [
                                                    new TextRun({
                                                        text: "Attention: ",
                                                        bold: true,
                                                    }),
                                                    new TextRun({
                                                        text: info.first_name + " " + info.last_name
                                                    }),
                                                    new TextRun({
                                                        text:"Address: ",
                                                        break:1
                                                    }),
                                                    new TextRun({
                                                        text:info.billing_address
                                                    }),
                                                    new TextRun({
                                                        text:"City: ",
                                                        break:1
                                                    }),
                                                    new TextRun({
                                                        text:info.city
                                                    }),
                                                    new TextRun({
                                                        text:"Postal Code: ",
                                                        break:1
                                                    }),
                                                    new TextRun({
                                                        text:info.post_code
                                                    }),
                                                    new TextRun({
                                                        text:"Phone: ",
                                                        break:1
                                                    }),
                                                    new TextRun({
                                                        text:info.phone_number
                                                    }),
                                                    new TextRun({
                                                        text:"Email: ",
                                                        break:1
                                                    }),
                                                    new TextRun({
                                                        text:info.email
                                                    }),
                                        ]
                                    }),
                                ]
                            }),
                            new TableCell({
                                borders:{
                                    right:{
                                        style:BorderStyle.NONE
                                    },
                                    left:{
                                        style:BorderStyle.NONE
                                    },
                                    top:{
                                        style:BorderStyle.NONE
                                    },
                                    bottom:{
                                        style:BorderStyle.NONE
                                    }
                                },
                                width:{
                                    size:5000,
                                    type:WidthType.DXA
                                },
                                children:[
                                    new Paragraph({
                                        children:[
                                            new TextRun({
                                                text:" ",
                                            }),
                                            new TextRun({
                                                text:"Site Address: ",
                                                break:1
                                            }),
                                            new TextRun({
                                                text:info.site_address
                                            }),
                                            new TextRun({
                                                text:"Site City: ",
                                                break:1
                                            }),
                                            new TextRun({
                                                text:info.site_city
                                            })
                                        ],
                                    }),
                                ]
                            })
                        ]
                    })
                ]}),
                    new Paragraph({

                    }),
                    new Table({
                        indent:{
                            size:-500,
                            type:WidthType.DXA
                        },
                        columnWidths:[10000],
                        
                        rows:[
                            new TableRow({
                                 
                                children:[
                                    new TableCell({
                                        width:{
                                            size:10000,
                                            type:WidthType.DXA
                                            },
                                            borders:{
                                                right:{
                                                    style:BorderStyle.NONE
                                                },
                                                left:{
                                                    style:BorderStyle.NONE
                                                },
                                                top:{
                                                    style:BorderStyle.NONE
                                                }
                                            },
                                        children:[
                                            new Paragraph({
                                                text:"Quote Products"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }),
                    new Table({
                       width:{
                           size:10000,
                           type:WidthType.DXA
                       },
                        rows: renderDetails(info)
                    }),
                    new Paragraph({
                        break:2
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
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${info.first_name}_${info.last_name}_${formatDate}_Quote.docx`;
    link.click();
    return (
        null
    );
}