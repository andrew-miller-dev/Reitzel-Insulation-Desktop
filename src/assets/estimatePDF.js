export async function file() {
    let filePDF = await fetch("crimson-ailsun-43.tiiny.site").then(r=> r.blob()).then(blobFile => new File([blobFile],"How to Prepare for Your Free Insulation Estimation",{type:"application/pdf"}));
    return filePDF;
}