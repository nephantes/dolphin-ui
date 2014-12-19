            </aside><!-- /.right-side -->
        </div><!-- ./wrapper -->


        <script type="text/javascript" language="javascript" src="//code.jquery.com/jquery-1.11.1.min.js"></script> 
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="//code.jquery.com/ui/1.10.3/jquery-ui.js"></script>
        <script src="//cdn.datatables.net/1.10.4/js/jquery.dataTables.min.js"></script>
        <script src="//cdn.datatables.net/plug-ins/725b2a2115b/integration/bootstrap/3/dataTables.bootstrap.js"></script>
        <script src="//cdn.datatables.net/tabletools/2.2.3/js/dataTables.tableTools.min.js"></script>
        
        <!-- AdminLTE App -->
        <script src="<?php echo BASE_PATH?>/js/AdminLTE/app.js" type="text/javascript"></script>

        <script type="text/javascript" language="javascript" src="<?php echo BASE_PATH?>/js/dataTables/dataTables.editor.js"></script>
        <script type="text/javascript" language="javascript" src="<?php echo BASE_PATH?>/js/dataTables/resources/syntax/shCore.js"></script>
        <script type="text/javascript" language="javascript" class="init">

var editor; // use a global for the submit and return data rendering in the examples
function toggleTable() {
    var lTable = document.getElementById("descTable");
    lTable.style.display = (lTable.style.display == "table") ? "none" : "table";
}

$(document).ready(function() {
        editor = new $.fn.dataTable.Editor( {
                "ajax": "/dolphin/public/php/ajax/samples.php",
                "table": "#samples",
                "fields": [ {
                                "label": "Series Name:",
                                "name": "ngs_samples.series_id",
				"type": "select",
                        }, {
                                "label": "Lane Name:",
                                "name": "ngs_samples.lane_id",
				"type": "select",
                        }, {
                                "label": "Protocol Name:",
                                "name": "ngs_samples.protocol_id",
				"type": "select",
                        }, {
                                "label": "Sample Name:",
                                "name": "ngs_samples.name",
                        }, {
                                "label": "Barcode:",
                                "name": "ngs_samples.barcode",
                        }, {
                                "label": "Title:",
                                "name": "ngs_samples.title",
                        }, {
                                "label": "Source:",
                                "name": "ngs_samples.source",
                        }, {
                                "label": "Orgnism:",
                                "name": "ngs_samples.organism",
                        }, {
                                "label": "Molecule:",
                                "name": "ngs_samples.molecule",
                        }, {
                                "label": "Description:",
                                "name": "ngs_samples.description",
                        }, {
                                "label": "Instrument Model",
                                "name": "ngs_samples.instrument_model",
                        }, {
                                "label": "Average Insert Size:",
                                "name": "ngs_samples.avg_insert_size",
                        }, {
                                "label": "Read Length:",
                                "name": "ngs_samples.read_length",
                        }, {
                                "label": "Genotype:",
                                "name": "ngs_samples.genotype",
                        }, {
                                "label": "Condition",
                                "name": "ngs_samples.condition",
                        }, {
                                "label": "Library Type",
                                "name": "ngs_samples.library_type",
                        }, {
                                "label": "3' Adapter",
                                "name": "ngs_samples.adapter",
                        }, {
                                "label": "Notebook Referance",
                                "name": "ngs_samples.notebook_ref",
                        }, {
                                "label": "Notes:",
                                "name": "ngs_samples.notes",
			}
                ]
        } );

        $('#samples').DataTable( {
                dom: "Tfrtip",
                ajax: "/dolphin/public/php/ajax/samples.php",
                columns: [
                        { data: "ngs_experiment_series.experiment_name" },
                        { data: "ngs_protocols.name" },
                        { data: "ngs_lanes.name" },
                        { data: "ngs_samples.name" },
                        { data: "ngs_samples.barcode" },
                        { data: "ngs_samples.title" },
                        { data: "ngs_samples.source" },
                        { data: "ngs_samples.organism" },
                        { data: "ngs_samples.molecule" },
                        { data: "ngs_samples.description" },
                        { data: "ngs_samples.instrument_model" },
                        { data: "ngs_samples.avg_insert_size" },
                        { data: "ngs_samples.read_length" },
                        { data: "ngs_samples.genotype" },
                        { data: "ngs_samples.condition" },
                        { data: "ngs_samples.library_type" },
                        { data: "ngs_samples.adapter" },
                        { data: "ngs_samples.notebook_ref" },
			{ data: "ngs_samples.notes" },
                ],
                tableTools: {
                        sRowSelect: "os",
                        aButtons: [
                                { sExtends: "editor_create", editor: editor },
                                { sExtends: "editor_edit",   editor: editor },
                                { sExtends: "editor_remove", editor: editor }
                        ]
                }
        } );
} );



        </script>


   </body>

</html>
