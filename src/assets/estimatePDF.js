export async function file() {
    let filePDF = await fetch("https://drive.google.com/file/d/1sVCg2-o59fUj4nn77XvD1TfxlLS-qNUP/view?usp=share_link",{mode:"no-cors"}).then(r=> r.blob()).then(blobFile => new File([blobFile],"How to Prepare for Your Free Insulation Estimation",{type:"application/pdf"}));
    return filePDF;
}