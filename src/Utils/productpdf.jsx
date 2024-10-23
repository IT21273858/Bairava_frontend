import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "./image/logo.png";
import Footerlogo from "./image/logo.png"
import { InknutAntiquaBold, k2d, Inter, InterSemiBold } from "./fonts";


const ProductPdfGenerator = (payload) => {
    console.log("Payload ss", payload);

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    doc.addFileToVFS("InknutAntiqua-Bold.ttf", InknutAntiquaBold);
    doc.addFont("InknutAntiqua-Bold.ttf", "InknutAntiqua", "normal");
    doc.addFileToVFS("k2d-normal.ttf", k2d);
    doc.addFont("k2d-normal.ttf", "k2d", "regular");
    doc.addFileToVFS("Inter.ttf", Inter);
    doc.addFont("Inter.ttf", "Inter", "regular");
    doc.addFileToVFS("Inter-SemiBold.ttf", InterSemiBold);
    doc.addFont("Inter-SemiBold.ttf", "Inter-SemiBold", "normal");

    const img = new Image();
    img.src = Logo;
    img.onload = () => {
        const imgWidth = 40;
        const imgHeight = 35;
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgXPosition = pageWidth - imgWidth - 10;

        doc.addImage(img, "PNG", 5, 5, imgWidth + 20, imgHeight);
        const title = payload.name;
        doc.setFont("InknutAntiqua", "normal");
        doc.setFontSize(16);
        doc.setTextColor(43, 0, 145);

        const titleXPosition = (pageWidth - doc.getTextWidth(title)) - 30;
        doc.text(title, titleXPosition, 20);

        doc.setFont("Inter", "regular");
        doc.setFontSize(12);
        doc.setTextColor(68, 3, 150);
        doc.text("Flavour:", titleXPosition, 30);
        doc.setTextColor(0, 0, 0);
        doc.text(payload.flavour || "001", titleXPosition + 25, 30);
        doc.setTextColor(68, 3, 150);
        doc.text("Price (Rs.):", titleXPosition, 35);
        doc.setTextColor(0, 0, 0);
        doc.text(payload.price || "001", titleXPosition + 25, 35);


        doc.addImage(Footerlogo, 'PNG', 70, 218, 70, 60)

        doc.setFont("k2d-normal.ttf", "normal");
        doc.setFontSize(15);
        doc.setTextColor(43, 0, 145);
        doc.text("Thank you for choosing Nodekidos for your Services !", pageWidth / 4, 285);


        // Footer
        const imgs = new Image();
        imgs.src = payload.barcode_image;
        doc.addImage(imgs, 'PNG', 60, 100, 100, 70)
        doc.save(`product_${payload.name}.pdf`);
    };
};

export default ProductPdfGenerator;
