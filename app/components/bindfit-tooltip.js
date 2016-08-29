import Ember from 'ember';

export default Ember.Component.extend({
    fitter: null,
    section: null,

    placement: "right",

    text: Ember.computed('fitter', function() {
        var fitter = this.get('fitter');
        var section = this.get('section');

        switch(fitter) {
            case "nmr1to1":
                switch(section) {
                    case "control-upload":
                        return "Excel or CSV file. First row = headers, Column 1 = host concentration, Column 2 = guest concentration and Columns 3-X for measured (raw) data with X = n+2 where n = different chemical shifts measured. See help for details.";

                    case "control-params":
                        return "If the fit fails or is bad, try changing this, e.g. 10 or 100 lower (or higher). Min and Max constrain the search space (does not work with the Nelder-Mead Fit option method).";

                    case "control-options-method":
                        return "Search algorithm. Nelder-Mead (Simplex) is the default and the more powerful option – we usually recommend you use this one. L-BFGS-B (quasi-Newtown) can be used if you think you need to constrain the search space using the min/max options in “K guess” but L-BFGS-B sometimes fails to find a good fit where Nelder-Mead succeeds.";

                    case "control-options-dilution":
                        return "Not applicable for NMR (makes no difference) as this only applies to UV-Vis methods. Default is \"unticked\".";

                    case "control-options-sub":
                        return "Default is \"ticked\". This means that the fitting process assumes the first data point (second row in input file) is the chemical shift of the pure host and therefore the fitting process only deals with the difference between the pure host and the complex(es). If \"unticked\" then the fitting process assumes the chemical shift for the host is unknown and includes that in the fitting process (one extra parameter).";
                    case "control-fit":
                        return "If you get message fit fail = the blue fit bar turns orange, try first to change your \"initial guess\" by a factor of 10-100 (downwards often works best). Sometime you also need to \"refresh\" (F5) and reload your data. Check if the input data plots ok and looks ok.";
                    default:
                        return "Tooltip not found";
                }
                break;

            case "uv1to1":
                switch(section) {
                    case "control-upload":
                        return "Excel or CSV file. First row = headers, Column 1 = host concentration, Column 2 = guest concentration and Columns 3-X for measured (raw) data with X = n+2 where n = different chemical shifts measured. See help for details.";

                    case "control-params":
                        return "If the fit fails or is bad, try changing this, e.g. 10 or 100 lower (or higher). Min and Max constrain the search space (does not work with the Nelder-Mead Fit option method).";

                    case "control-options-method":
                        return "Search algorithm. Nelder-Mead (Simplex) is the default and the more powerful option – we usually recommend you use this one. L-BFGS-B (quasi-Newtonian) can be used if you think you need to constrain the search space using the min/max options in \"K guess\" but L-BFGS-B sometimes fails to find a good fit where Nelder-Mead succeeds.";

                    case "control-options-dilution":
                        return "This corrects, if necessary for the dilution of the host. Default is \"unticked\", meaning there is no dilution of the host throughout the titration. \"Ticked\" means that the program will correct for the dilution of the host in the fitting process when it comes to the.";

                    case "control-options-sub":
                        return "Default is \"ticked\". This means that the fitting process assumes the first data point (second row in input file) is the absorbance of the pure host and therefore the fitting process only deals with the difference between the pure host and the complex(es). If \"unticked\" then the fitting process assumes the absorbance of the host is unknown and includes that in the fitting process (one extra parameter).";

                    case "control-fit":
                        return "If you get message fit fail = the blue fit bar turns orange, try first to change your \"initial guess\" by a factor of 10-100 (downwards often works best). Sometime you also need to \"refresh\" (F5) and reload your data. Check if the input data plots ok and looks ok.";

                    default: 
                        return "Tooltip not found";
                }
                break;

            case "template":
                switch(section) {
                    case "control-upload":
                        return "";

                    case "control-params":
                        return "";

                    case "control-options-method":
                        return "";

                    case "control-options-dilution":
                        return "";

                    case "control-options-sub":
                        return "";

                    case "control-fit":
                        return "";

                    default: 
                        return "Tooltip not found";
                }
                break;

            default:
                return "Tooltip not found";
        }
    })
});
