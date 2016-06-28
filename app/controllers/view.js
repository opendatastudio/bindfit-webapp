import Ember from 'ember';

import { fitDataSlice, fitDataFilter } from '../utils/fit-data';


export default Ember.Controller.extend({
    // Pagination
    NUMBER_ROWS_PAGE: 5,
    currentPage: 1,
    //countPages: 0, // set onUploadComplete
   
    // picker: false
    // pager: true
    // because i'm an idiot
    usePicker: true,


    selectedFits: [],
    selectedResults: [],

    paramsLabelled: function() {
        /***
         * Compute array of labelled parameters for display in template
         */
        var labels = this.get("model.fitLabels.fit.params");
        return this.get("model.fitResult").paramsLabelled(labels);
    }.property("model.fitResult.fit.params", "model.fitLabels.fit.params"),
  
    selectedFitResults: function() {
    },

    fitResults: function() {
      return this.get("model.fitResult");
    }.property("model.fitResult.data.y"),

    numberFits: function() {
      var fitResult = this.get("fitResult");

      if (fitResult) {
        return fitResult.data.y.length();
      } else {
        return null;
      }
    }.property("fitResults"),
   
    countPages: function() {
      this.set("currentPage", 1);
      var numberFits = this.get("numberFits");

      var NUMBER_ROWS_PAGE = this.get("NUMBER_ROWS_PAGE");
      var numberPages = parseInt(numberFits / NUMBER_ROWS_PAGE, 10);
      
      return numberPages; 
    }.property("numberFits", "NUMBER_ROWS_PAGE"),

    pagedFitResults: function() {
        var usePicker = this.get("usePicker");
        // move elsewhere
        // hi, this is wrong!
        var _this = this; 
        var fitResult = _this.get("model.fitResult");
        
        if (usePicker) {
          var numberFits = this.get("model.fitResult.data.y").length;

          var NUMBER_ROWS_PAGE = this.get("NUMBER_ROWS_PAGE");
          var numberPages = parseInt(numberFits / NUMBER_ROWS_PAGE, 10);

          // TODO hi this is extremely wrong
          this.set("countPages", numberPages);
          // end move elsewhere
          //
          var currentPage = _this.get("currentPage");

          var countPages = _this.get("countPages");
          var n = _this.get("NUMBER_ROWS_PAGE");

          var startIndex = (currentPage-1)*n; 
          var endIndex = startIndex + n; // +1 ?? 

          if (!fitResult.labels.data.y) { 
              return fitResult;
          }

          var paged = fitDataSlice(fitResult, startIndex, endIndex);

        } else {
          var selectedFits = this.get("selectedFits");
          
          var rowLabels = fitResult.labels.data.y.row_labels; 

          var selectedFitsIndices = selectedFits.map(function(x) {
            return rowLabels.indexOf(x);  
          });

          var paged = fitDataFilter(fitResult, selectedFitsIndices);
        }

        return paged;
    }.property("currentPage", "selectedFits.[]"),
});
