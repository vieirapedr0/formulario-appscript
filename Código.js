const FORM_ID = '1xRss6E1ZllY2hUV2vq--TES1XTjSKquU033Zrl3WLc4'


function respostaPorID() {
  const form = FormApp.openById(FORM_ID);
  const formItems = form.getItems();

  formItems.forEach(item => console.log(item.getTitle() + ' ' + item.getId()));
  /*
    Nome 997107242
  	Email 191621373
  	Você é Dev? 508470225
  	Quais Linguagens você desesvolve? 1238579853
  */
}

function updateForm() {
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const form = FormApp.openById(FORM_ID);

  
  const setupSheet = ss.getSheetByName('setup');
  const setupSheetValues = setupSheet.getRange(2,1,setupSheet.getLastRow()-1,1).getValues().flat();
  
  const responsesSheet = ss.getSheetByName('form');
  const data = responsesSheet.getRange(2,5,responsesSheet.getLastRow()-1,1).getValues().flat();
  const submittedFormValues = data.join().split(',');
  console.log(submittedFormValues); 
  

  
  const formCheckboxChoices = form.getItemById('1238579853').asCheckboxItem().getChoices();
  const formCheckboxValues = formCheckboxChoices.map(x => x.getValue());
 

  const allLangs = [...formCheckboxValues,...setupSheetValues,...submittedFormValues];
  
  const trimAllLangs = allLangs.map(item => item.trim());
  
  trimAllLangs.sort();

  let finalLangList = trimAllLangs.filter((lang,i) => trimAllLangs.indexOf(lang) === i);
  

  
  finalLangList = finalLangList.filter(item => item.length !== 0);
  
  
  
  finalLangList = finalLangList.filter(item => item !== 'Nenhuma');
  finalLangList.unshift('Nenhuma');
  

  
  const finalDoubleArray = finalLangList.map(lang => [lang]);
  
  setupSheet.getRange("A2:A").clear();
  setupSheet.getRange(2,1,finalLangList.length,1).setValues(finalDoubleArray);

  
  form.getItemById('1238579853').asCheckboxItem().setChoiceValues(finalLangList); 

}

function sendEmail(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const responseSheet = ss.getSheetByName('form');
  const data = responseSheet.getDataRange().getValues();
  data.shift


  data.forEach((row,i) => {

    if(row[5] === ''){
      const nome = row[1]
      const email = row[2]
      const resposta = row[3]
      const linguagens = row[4]

      const subject = 'Obrigado por responder o questionario';
      let body = ' ';

      if(resposta === 'Sim') {

        body = 'Contamos com sua experiencia';

      }
      else {
        body = 'Vamos aprender a programar juntos';
      }
      
      GmailApp.sendEmail(email,subject,body)

      const d = new Date();
      responseSheet.getRange(i + 1,6).setValue(d);
      
    }
    else {
      console.log('No email sent for this row');
    }
  });
}
 
function onOpen() {
  
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu("Menu")
    .addItem("Atualizar Form","updateForm")
    .addItem("Enviar Emails","sendEmail")
    .addToUi();
  
}




