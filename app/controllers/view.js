import Ember from 'ember';

export default Ember.Controller.extend({
    // Pagination
    NUMBER_ROWS_PAGE: 5,
    currentPage: 1,
    countPages: 0, // set onUploadComplete
    
    usePicker: false,

    selectedFits: [],


    test: Ember.observer("usePicker", function() {
      this.debug("usePicker value: ", this.get("usePicker"));
    }),

    paramsLabelled: function() {
        /***
         * Compute array of labelled parameters for display in template
         */
        var labels = this.get("model.fitLabels.fit.params");
        return this.get("model.fitResult").paramsLabelled(labels);
    }.property("model.fitResult.fit.params", "model.fitLabels.fit.params"),
   
    
    selectedFitsChanged: Ember.observer('selectedFits.[]' ,function() {
        this.debug("hi world from controller!!!");
        var fitResult = _this.get("model.fitResult");

        return fitResult;
    }),
    
    // TODO generalise for everything, really
    pagedFitResults: function() {
        // move elsewhere
        // hi, this is wrong!
        var numberFits = this.get("model.fitResult.data.y").length;

        var NUMBER_ROWS_PAGE = this.get("NUMBER_ROWS_PAGE");
        var numberPages = parseInt(numberFits / NUMBER_ROWS_PAGE, 10);

        // TODO hi this is extremely wrong
        this.set("countPages", numberPages);
        // end move elsewhere
        //
        this.debug("pagedFitResults: helloWorld");
        var _this = this; 
        var currentPage = _this.get("currentPage");
        var fitResult = _this.get("model.fitResult");

        this.debug("fitResult", fitResult);
        var countPages = _this.get("countPages");
        var n = _this.get("NUMBER_ROWS_PAGE");

        var startIndex = (currentPage-1)*n; 
        var endIndex = startIndex + n; // +1 ?? 
      
        

        if (!fitResult.labels.data.y) { 
            return fitResult;
        }

        var paged = JSON.parse(JSON.stringify(fitResult)); 

        paged["labels"]["data"]["y"]["row_labels"] = 
            fitResult.labels.data.y.row_labels.slice(startIndex,endIndex);
       
        paged["data"]["y"] = 
            fitResult.data.y.slice(startIndex,endIndex);
        
        paged["data"]["x"] = 
            fitResult.data.x.slice(startIndex,endIndex);
       
        if (fitResult.qof.residuals) {
            paged["qof"]["residuals"]= 
              fitResult.qof.residuals.slice(startIndex, endIndex);
        }

        if (fitResult.qof.cov) {
            paged["qof"]["cov"]= 
              fitResult.qof.cov.slice(startIndex, endIndex);
        }
        
        if (fitResult.qof.rms) {
            paged["qof"]["rms"]= 
              fitResult.qof.rms.slice(startIndex, endIndex);
        }

        if (fitResult.fit.y) {
            paged["fit"]["y"] = 
                fitResult.fit.y.slice(startIndex,endIndex);
        }
        
        if (fitResult.fit.coeffs[0]) {
            paged.fit.coeffs[0] = fitResult.fit.coeffs[0].slice(startIndex, endIndex);
        }
        
        if (fitResult.fit.coeffs[1]) {
            paged.fit.coeffs[1] = fitResult.fit.coeffs[1].slice(startIndex, endIndex);
        }

        if (fitResult.fit.coeffs[2]) {
            paged.fit.coeffs[2] = fitResult.fit.coeffs[2].slice(startIndex, endIndex);
        }

        return paged;
    }.property("model.fitResult.fit.y", "currentPage", "countPages"),
});
