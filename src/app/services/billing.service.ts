import { Injectable } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(
    private glb : GlobalsService,
  ) { }

  generateClientBilling(data) {
    const documentDefinition = this.getClinetDocumentDefinition(data);
    //const documentDefinition = { content: 'This is an sample PDF printed with pdfMake' };
    pdfMake.createPdf(documentDefinition).download();
  }
 

 getProfilePicObject(data) {
  if (data.profilePic) {
    return {
      image: data.profilePic ,
      width: 75,
      alignment : 'right'
    };
  }
  return null;
}


getExperienceObject(experiences) {
  const exs = [];
    exs.push(
      [{
        columns: [
          [{
            text: 'experience.jobTitle',
            style: 'jobTitle'
          },
          {
            text: 'experience.employer',
          },
          {
            text: 'experience.jobDescription',
          }],
          {
            text: 'Experience : ' + 'experience.experience' + ' Months',
            alignment: 'right'
          }
        ]
      }]
    );
    exs.push(
      [{
        columns: [
          [{
            text: 'experience.jobTitle',
            style: 'jobTitle'
          },
          {
            text: 'experience.employer',
          },
          {
            text: 'experience.jobDescription',
          }],
          {
            text: 'Experience : ' + 'experience.experience' + ' Months',
            alignment: 'right'
          }
        ]
      }]
    );

  return {
    table: {
      widths: ['*'],
      body: [
        ...exs
      ]
    }
  };
}


getEducationObject(data) {
  return {
    table: {
      widths: ['*', '*', '*', '*'],
      body: [
        [{
          text: 'Description',
          style: 'tableHeader'
        },
        {
          text: 'Qté',
          style: 'tableHeader'
        },
        {
          text: 'prix unitaire',
          style: 'tableHeader'
        },
        {
          text: 'Prix total',
          style: 'tableHeader'
        },
        ],
        [{
          text: 'Location de ' + data['brand'] + ' '+ data['model'],
        },
        {
          text: parseInt(data['totalPrice']) / parseInt(data['pricePerDay']),

        },
        {
          text: parseInt(data['pricePerDay']),

        },
        {
          text: parseInt(data['totalPrice']),
    
        },
        ],
     
      ]
    }
  };
}


getClinetDocumentDefinition(data) {
  //sessionStorage.setItem('resume', JSON.stringify(this.resume));
  return {
    content: [
      {
        text: 'FACTURE',
        bold: true,
        fontSize: 20,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      },

      {
        columns: [
          [{
            text: data['agencyName'],
            style: 'name'
          },
          {
            text: data['agencyAdress'],
          },
          {
            text: data['agencyBEmail']
          },
          {
            text: data['agencyMobile'],
          },
          {
            // think to put the logo of the agency
          },
          {
            text: ' ',
          },
          ],
          [
            this.getProfilePicObject(data['picturesList'][0]) 
          ]
        ]
      },
      {
        text: 'Facture N° : ' + data['id'] + '-' + this.glb.user.id + data['bid'] + ' Pour :',
        style: 'header'
      },
      {
        columns: [
          [
          {
            text: this.glb.user.fname,
            style: 'name'
          },
          {
            text: this.glb.user.address
          },
          {
            text: 'Email : ' + this.glb.user.email,
          },
          {
            text: 'Contant No : ' + this.glb.user.phoneNumber,
          },
          {
            text: ''
          }
          ],
          [
            this.getProfilePicObject(data['picturesList'][0]) 
          ]
        ]
      },
      {
        text: ' ',
      },
      {
        text: ' ',
      },

      {
        text: 'Détail',
        style: 'header'
      },
    
      this.getEducationObject(data),
      {
        text: 'Other Details',
        style: 'header'
      },
      {
        text: 'this.resume.otherDetails'
      },
      {
        text: 'Signature',
        style: 'sign'
      },
      {
        columns : [
            { qr: data['guid_book'], fit : 100 },
            {
            text: data['agencyName'],
            alignment: 'right',
            }
        ]
      }
    ],
    info: {
      title: 'this.resume.name' + '_RESUME',
      author: 'this.resume.name',
      subject: 'RESUME',
      keywords: 'RESUME, ONLINE RESUME',
    },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 10],
          decoration: 'underline'
        },
        name: {
          fontSize: 16,
          bold: true
        },
        jobTitle: {
          fontSize: 14,
          bold: true,
          italics: true
        },
        sign: {
          margin: [0, 50, 0, 10],
          alignment: 'right',
          italics: true
        },
        tableHeader: {
          bold: true,
        }
      }
  };
}


  generateAgencyBilling(data) { }
  generateAgencyReport(data)  { }
}
