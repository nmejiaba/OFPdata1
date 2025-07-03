async function processPDF() {
  const fileInput = document.getElementById('pdf-upload');
  const output = document.getElementById('output');
  if (!fileInput.files.length) return alert("Please upload a PDF");

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.onload = async function() {
    const typedArray = new Uint8Array(reader.result);
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str).join('\n');
      fullText += strings + '\n';
    }

    // Extract sections
    const sections = {
      weather: extractSection(fullText, "WX FORECAST", "NOTAMS"),
      notams: extractSection(fullText, "NOTAMS", "EXTENDED AREA"),
      firs: extractSection(fullText, "EXTENDED AREA", "WX|$"), // fallback end
    };

    output.textContent = JSON.stringify(sections, null, 2);

    // TODO: Replace with your Google Apps Script WebApp URL
fetch("https://script.google.com/macros/s/AKfycbz7jlrX7fi5Bh18lzCDpIk0XnXpkDmI0CyqyCpa6Tr84rJhQHXfadA6wQ_vepvnuMm5rw/exec", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(sections)
})
.then(response => response.text())
.then(result => {
  console.log("Server Response:", result);
  alert("Server says: " + result);
})
.catch(error => {
  console.error("Error sending to Google Sheets:", error);
  alert("Failed to send to Google Sheets. See console for details.");
});




  };
  reader.readAsArrayBuffer(file);
}

function extractSection(text, startKeyword, endKeyword) {
  const start = text.indexOf(startKeyword);
  const end = text.indexOf(endKeyword, start + startKeyword.length);
  return text.slice(start, end > -1 ? end : undefined).trim();
}
