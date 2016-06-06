import Ember from 'ember';



export default Ember.Component.extend({
  /*n:           null,*/
  //currentPage: null,
  //countPages:  null,
  /*fitResult:   null,*/

  pagedFitResult: function() {
    var _this = this;

    var fitResult = _this.get("fitResult");
    var currentPage = _this.get("currentPage");
    var countPages = _this.get("countPages");
    var n = _this.get("n");

    this.debug("currentPage: " + currentPage);
    this.debug("n: " + n);

    var startIndex = (currentPage-1)*n; 
    var endIndex = startIndex + n; // +1 ?? 
   
    this.debug ("startIndex: " + startIndex);
    this.debug ("endIndex: " + endIndex);
    this.debug(fitResult.fit.coeffs);

    // TODO hate
    // there is a whole heap of technical debt to fix here...
    var paged = {
      labels: {
        data: {
          y: {
            row_labels: fitResult.labels.data.y.row_labels.slice(startIndex,endIndex)
          }
        }
      },
      qof: {
        cov: fitResult.qof.cov.slice(startIndex,endIndex),
        rms: fitResult.qof.rms.slice(startIndex,endIndex),
        cov_total: fitResult.qof.cov_total,
        rms_total: fitResult.qof.rms_total,
        ssr: fitResult.qof.ssr,
      },
      fit: {
        coeffs: {
          0: fitResult.fit.coeffs[0].slice(startIndex,endIndex), 
          1: fitResult.fit.coeffs[1].slice(startIndex,endIndex),
          2: fitResult.fit.coeffs[2].slice(startIndex,endIndex),
        },
        n_y: fitResult.fit.n_y,
        n_params: fitResult.fit.n_params,
      },
        time: fitResult.time,
      };

      //    2: fitResult.fit.coeffs[2].slice(startIndex,endIndex),

    this.debug(paged);

    return paged;
  }.property("fitResult", "currentPage", "countPages", "n"),

  paramsLabelled: function() {
    console.log("COMPONENT fit-result-table: called");
    var labels = this.get("fitLabels.fit.params");

    var results = 
      this.get("fitResult").paramsLabelled(labels);

    return results;
  }.property("fitResult.params", "fitLabels.fit.params"),

});
