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

export interface IHeroWebPartProps {
  Title:string;
  description: string;
  SolidColor:string;
  filePickerResult: IFilePickerResult;
}

export default class HeroWebPart extends BaseClientSideWebPart<IHeroWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.hero }">
        <div class="${ styles.container }">
        <div class="${ styles.row }" style="background-image:url(${this.properties.filePickerResult.fileAbsoluteUrl})"/>
            <div class="${ styles.column }">
              <center><p class="${ styles.description }">${escape(this.properties.Title)}</p></center>
             <center> <p class="${ styles.description }">${escape(this.properties.description)}</p></center>
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
                    debugger;
                    console.log(e); this.properties.filePickerResult = e; 
                   },
                  onChanged: (e: IFilePickerResult) => 
                  {
                    debugger; 
                    console.log(e); 
                     this.properties.filePickerResult = e;
                       
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
