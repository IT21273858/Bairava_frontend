import jsPDF from "jspdf";
import "jspdf-autotable";
import Logo from "./image/Logo-light Theme.png";
import { InknutAntiquaBold, k2d, Inter, InterSemiBold } from "./fonts";
import PhoneIcon from "./image/caller.png";
import MailIcon from "./image/mail.png";
import LocationIcon from "./image/location.png";

const PDFGenerator = (payload) => {
  console.log("Payload ss",payload);
  
  // Create a new jsPDF instance with A4 size
  const doc = new jsPDF({
    orientation: "portrait", // or "landscape"
    unit: "mm",
    format: "a4"
  });

  // Add custom fonts
  doc.addFileToVFS("InknutAntiqua-Bold.ttf", InknutAntiquaBold);
  doc.addFont("InknutAntiqua-Bold.ttf", "InknutAntiqua", "normal");
  doc.addFileToVFS("k2d-normal.ttf", k2d);
  doc.addFont("k2d-normal.ttf", "k2d", "regular");
  doc.addFileToVFS("Inter.ttf", Inter);
  doc.addFont("Inter.ttf", "Inter", "regular");
  doc.addFileToVFS("Inter-SemiBold.ttf", InterSemiBold);
  doc.addFont("Inter-SemiBold.ttf", "Inter-SemiBold", "normal");

  // Add Logo on the right side
  const img = new Image();
  img.src = Logo;
  img.onload = () => {
    const imgWidth = 40;
    const imgHeight = 35;
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgXPosition = pageWidth - imgWidth - 10;

    doc.addImage(img, "PNG", imgXPosition, 10, imgWidth, imgHeight);

    // Title with aligned logo
    const title = "Reservation Vouchers";
    doc.setFont("InknutAntiqua", "normal");
    doc.setFontSize(16);
    doc.setTextColor(43, 0, 145);

    const titleXPosition = (pageWidth - doc.getTextWidth(title)) / 2;
    doc.text(title, titleXPosition, 25);

    // Tour Id and Voucher No.
    doc.setFont("Inter", "regular");
    doc.setFontSize(12);
    doc.setTextColor(68, 3, 150);
    doc.text("Tour Id         :", 14, 35);
    doc.setFont("k2d", "regular");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(payload.tour_id || "001", 40, 35);
    doc.setFont("Inter", "regular");
    doc.setFontSize(12);
    doc.setTextColor(68, 3, 150);
    doc.text("Voucher No :", 14, 40);
    doc.setFont("k2d", "regular");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(payload.voucher_no || "001", 40, 40);
    const trimmedDate_Dep = payload.departure_date.slice(0, 10);
    const trimmedDate_Arr = payload.arrivate_date.slice(0, 10);
    
    // Client Information Table
    const clientInfo = [
      ["Client Name", payload.guest_name || "N/A"],
      ["Hotel", payload.hotel_name || "N/A"],
      ["Voucher Status", payload.v_status || "N/A"],
      ["Pax Count (Adults)", payload.paxcount_a || "N/A"],
      ["Pax Count (Kids-0 to 5)", payload.paxcount_kid || "N/A"],
      ["Pax Count (Kids-6 to 12)", payload.paxcount_kids || "N/A"],
      ["Departure Date", trimmedDate_Dep || "N/A"],
      ["Arrival Date", trimmedDate_Arr || "N/A"],
      ["Number of Rooms", payload.no_of_rooms || "N/A"],
      ["Number of Nights", payload.no_of_nights || "N/A"],
      ["Meal Plan", payload.meal_plan || "N/A"],
      ["Requested Meal", payload.requested_meal || ""],
      ["Nationality", payload.nationality || "N/A"],
      ["Guest's Requirement", payload.guest_requirement || ""],
      ["Remarks", payload.remarks || ""],
      ["Payment Method", payload.payment_method || "N/A"],
    ];

    doc.autoTable({
      body: clientInfo,
      startY: 45,
      theme: "grid",
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [33, 33, 33],
        halign: "center",
        lineWidth: 0.1,
        lineColor: [68, 3, 150],
        cellPadding: 3,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: [68, 3, 150],
        cellPadding: 3,
      },
      columnStyles: {
        0: {
          cellWidth: 65,
          textColor: [68, 3, 150],
        },
        1: { cellWidth: 120 },
      },
      tableLineColor: [68, 3, 150],
    });

    // Table for Product Details
    const productDetails = payload.product.map(product => [
      product.name || "N/A",
      product.room_count || "N/A",
      product.night_count || "N/A",
      product.price || "N/A",
      product.total || "N/A",
    ]);

    doc.autoTable({
      head: [["Product", "Room Count", "Night Count", "Price", "Total"]],
      body: productDetails,
      startY: doc.autoTable.previous.finalY + 10,
      theme: "grid",
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [43, 0, 145],
        fontStyle: "bold",
        lineWidth: 0.1,
        lineColor: [68, 3, 150],
        cellPadding: 3,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10,
        lineWidth: 0.1,
        lineColor: [68, 3, 150],
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 },
      },
      tableLineColor: [68, 3, 150],
    });

    // Calculate Grand Total
    const grandTotal = payload.product.reduce((sum, product) => {
      const productTotal = parseFloat(product.total) || 0;
      console.log(`Product Total: ${product.total}, Parsed Total: ${productTotal}`);
      return sum + productTotal;
    }, 0);
    
    console.log(`Grand Total: ${grandTotal}`);
    

    // Grand Total
    doc.autoTable({
      body: [["Grand Total:", `${grandTotal.toFixed(2)}$`]],
      startY: doc.autoTable.previous.finalY,
      theme: "plain",
      bodyStyles: {
        textColor: [43, 0, 145],
        fontStyle: "bold",
        fillColor: [255, 255, 255],
        cellPadding: 3,
      },
      columnStyles: {
        0: {
          cellWidth: 155,
          lineColor: [68, 3, 150],
          halign: "center",
        },
        1: {
          cellWidth: 30,
          lineColor: [68, 3, 150],
          halign: "left",
        },
      },
      tableLineColor: [68, 3, 150],
      didDrawCell: (data) => {
        if (data.row.index === 0) {
          doc.setDrawColor(68, 3, 150);
          doc.setLineWidth(0.1);
          doc.rect(
            data.cell.x,
            data.cell.y,
            data.cell.width,
            data.cell.height,
            "S"
          );
        }
      },
    });

    // Footer with icons
    const margin = 14;
    const iconWidth = 5.5;
    const footerSpacing = 72;

    const footerItems = [
      { icon: PhoneIcon, text: ["Praneeth Rahul", "(+94 769 936 956)"] },
      { icon: MailIcon, text: ["info@vibeslanka.com"] },
      { icon: LocationIcon, text: ["No.126,", "Galle Road, Colombo"] },
    ];

    doc.setFont("Inter-SemiBold", "normal");
    doc.setFontSize(10);
    doc.setTextColor(43, 0, 145);

    footerItems.forEach((item, index) => {
      const img = new Image();
      img.src = item.icon;
      const iconX = margin + index * footerSpacing;
      const textX = iconX + iconWidth + 1;
      const yPos = 285;

      doc.addImage(img, "PNG", iconX, yPos - 3.5, iconWidth, 5);
      item.text.forEach((line, lineIndex) => {
        doc.text(line, textX, yPos + lineIndex * 4);
      });
    });

    doc.save(`${payload.voucher_no}.pdf`);
  };
  
  return null;
};

export default PDFGenerator;
