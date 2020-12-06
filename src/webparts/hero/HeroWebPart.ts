import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { PropertyFieldSwatchColorPicker, PropertyFieldSwatchColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldSwatchColorPicker';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyFieldFilePicker, IPropertyFieldFilePickerProps, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { escape } from '@microsoft/sp-lodash-subset';
import styles from './HeroWebPart.module.scss';
import * as strings from 'HeroWebPartStrings';
import {
  SPHttpClient,
  SPHttpClientResponse   
 } from '@microsoft/sp-http';
export interface IHeroWebPartProps {
  Title:string;
  description: string;
  SolidColor:string;
  filePickerResult: IFilePickerResult;
}
export interface ISPLists {
  Title: string;
  atsNewsDescription : string;
  atsNewsImageUrl: string;
}
export default class HeroWebPart extends BaseClientSideWebPart<IHeroWebPartProps> {

  //componentDidMount() {  
    //debugger;
//alert("Hi");

  //}

 // public componentWillMount() {
   // debugger;
    //alert('hi');
  //}
  public onInit(): Promise<void> {
    return super.onInit().then(_ => {
      // other init code may be present
      this._getListData().then((res)=>{
        debugger;
        console.log(res);
      });
    });
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.hero }">
        <div class="${ styles.container }">
        <div class="${ styles.row }" style="background-color:${this.properties.SolidColor}">
            <div class="${ styles.column }">
              <center><p class="${ styles.description }">${escape(this.properties.Title)}</p></center>
             <center> <p class="${ styles.description }">${escape(this.properties.description)}</p></center>
             <img style="width:auto;height:300px" src="${this.properties.filePickerResult.fileAbsoluteUrl}"/>
              <p class="${ styles.description }">${escape(this.properties.filePickerResult.fileAbsoluteUrl)}</p>
                <span class="${ styles.label }">Learn more </span>
            </div>
          </div>
        </div>
      </div>`;
    }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('News List')/Items",SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
         
        return response.json();
        });
    }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
              PropertyPaneTextField('description', {
                label: 'Description',
                multiline: true
              }),
              PropertyPaneTextField('Title', {
                label: 'Text Field',
              }),

              PropertyFieldSwatchColorPicker("SolidColor", {
                label: 'Color',
                selectedColor: this.properties.SolidColor,
                colors: [
                  { color: '#ffb900', label: 'Yellow' },
                  { color: '#fff100', label: 'Green' },
                  { color: '#d83b01', label: 'Orange'},
                  { color: '#e81123', label: 'Red' },
                ],
                onPropertyChange: this.onPropertyPaneFieldChanged,
                properties: this.properties,
                key: 'colorFieldId'
                }),

                PropertyFieldFilePicker('filePicker', {
                  context: this.context,
                  filePickerResult: this.properties.filePickerResult,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onSave: (e: IFilePickerResult) => { 
                    console.log(e); this.properties.filePickerResult = e; 
                    
                   },
                  onChanged: (e: IFilePickerResult) => 
                  {
                    console.log(e); 
                     this.properties.filePickerResult = e;
                     this._getListData();
                       
                  },
                  key: "filePickerId",
                  buttonLabel: "File Picker",
                  label: "Pick background Image",                  
              }),
            ]
            }
          ]
        }
      ]
    };
  }
}
