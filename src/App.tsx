import React from 'react';
import { DetailsList, IColumn, TextField, PrimaryButton } from "office-ui-fabric-react";
import './App.css';

export interface State {
  items: any[];
  searchString: string;
  columns: IColumn[];
  isButtonDisabled: boolean;
  category: string;
  newItems: any[];
}
export type Props = {};

class App extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)

    const columns: IColumn[] = [
      {
       key: "name",
       name: "Name",
       fieldName: "name",
       minWidth: 210,
       maxWidth: 350, 
      },
      {
        key: "codes",
        name: "Codes",
        fieldName: "codes",
        minWidth: 70,
        maxWidth: 90, 
       },
       {
        key: "synonyms",
        name: "Synonyms",
        fieldName: "synonyms",
        minWidth: 210,
        maxWidth: 350, 
       },
      {
        key: "category",
        name: "Category",
        fieldName: "category",
        minWidth: 210,
        maxWidth: 350, 
       },
       {
        key: "count",
        name: "Count",
        fieldName: "count",
        minWidth: 210,
        maxWidth: 350, 
       },
    ];

    this.state = {
      items: [],
      searchString: "",
      columns: columns,
      isButtonDisabled: false,
      category: "",
      newItems: [],
    }

    this.updateSearchString = this.updateSearchString.bind(this);
    this.search = this.search.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.filterList = this.filterList.bind(this);
  }

  public render(): React.ReactElement {
    const { columns, newItems } = this.state;

    return (
      <div className="App">
        <h1>MSKCC Search</h1>
        <div className="search-container">
          <TextField
            placeholder="Please enter your search string"
            value={this.state.searchString}
            onChange={this.updateSearchString}
            styles={{ fieldGroup: { width: 300 }}}
            onKeyPress={(event) => {
              if (event.key === "Enter" && this.state.isButtonDisabled) {
                this.search();
              }
            }}
          />
          <PrimaryButton
            className="button-container"
            text="Search"
            onClick={this.search}
          />
        </div>
        <div className="filter-container">
          <TextField
            placeholder="Filter by category"
            value={this.state.category}
            onChange={this.updateCategory}
            styles={{ fieldGroup: { width: 150 }}}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                this.filterList();
              }
            }}
          />
          <PrimaryButton
            className="button-container"
            text="Enter"
            onClick={this.filterList}
          />
        </div>
        
        <div>
        {this.state.newItems.length > 0 ?
          <DetailsList
            items={newItems}
            columns={columns}
          />
          :
          <h6>Search to get your result</h6> }
        </div>
      </div>
    );
  }

  private updateSearchString (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
    this.setState({
      searchString: newValue || "",
      isButtonDisabled: true,
    });
  }

  private updateCategory(ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
    this.setState({
      category: newValue || "",
    });
  }

  private search(): void {
    const API: string = "https://clinicaltrialsapi.cancer.gov/v1/Interventions";
    let parameter: string = "";
    parameter = this.state.searchString ? "?size=10&name=" + this.state.searchString : "";

    // get data from api
    fetch(API + parameter)
    .then(response => response.json())
    .then(data => {
      this.setState({
        items: data.terms,
        isButtonDisabled: false,
        newItems: data.terms,
      });
    })
  }

  private filterList(): void {
    if (!this.state.category) {
      return;
    }

    const tmpItemList: any[] = this.state.items.filter((item) => { return item.category === this.state.category});
    this.setState({
      newItems: tmpItemList,
      category: "",
    });
  }
}

export default App;
