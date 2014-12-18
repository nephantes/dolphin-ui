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
                "ajax": "/dolphin/public/php/lanes.php",
                "table": "#lanes",
                "fields": [ {
                                "label": "Series Name:",
                                "name": "ngs_lanes.series_id",
				"type": "select",
                        }, {
                                "label": "Lane Name:",
                                "name": "ngs_lanes.name",
                        }, {
                                "label": "Sequencing Facility:",
                                "name": "ngs_lanes.facility",
                        }, {
                                "label": "Cost:",
                                "name": "ngs_lanes.cost",
                        }, {
                                "label": "Date Submitted:",
                                "name": "ngs_lanes.date_submitted",
				"type": "date",
				"dateImage" : "/dolphin/public/img/calender.png",
                		"def": function () { return new Date(); },
                		dateFormat: $.datepicker.ISO_8601
                        }, {
                                "label": "Date received:",
                                "name": "ngs_lanes.date_received",
				"type": "date",
				"dateImage" : "/dolphin/public/img/calender.png",
                		"def": function () { return new Date(); },
                		dateFormat: $.datepicker.ISO_8601
                        }, {
                                "label": "Total reads:",
                                "name": "ngs_lanes.total_reads",
                        }, {
                                "label": "% PhiX requested:",
                                "name": "ngs_lanes.phix_requested",
				"type":  "radio",
                		"options": [
                    		{ label: "No", value: "No" },
                    		{ label: "Yes",  value: "Yes" }
                		],
                		"default": "No"
                        }, {
                                "label": "% PhiX lane:",
                                "name": "ngs_lanes.phix_in_lane",
                        }, {
                                "label": "# of Samples:",
                                "name": "ngs_lanes.total_samples",
                        }, {
                                "label": "Resequenced?",
                                "name": "ngs_lanes.resequenced",
				"type":  "radio",
                		options: [
                    		{ label: "No", value: 0 },
                    		{ label: "Yes",  value: 1 }
                		],
                		"default": 0 
                        }, {
                                "label": "Notes:",
                                "name": "ngs_lanes.notes",
			}
                ]
        } );

        $('#lanes').DataTable( {
                dom: "Tfrtip",
                ajax: "/dolphin/public/php/lanes.php",
                columns: [
                        { data: "ngs_experiment_series.experiment_name" },
                        { data: "ngs_lanes.name" },
                        { data: "ngs_lanes.facility" },
                        { data: "ngs_lanes.cost" },
                        { data: "ngs_lanes.date_submitted" },
                        { data: "ngs_lanes.date_received" },
                        { data: "ngs_lanes.total_reads" },
                        { data: "ngs_lanes.phix_requested" },
                        { data: "ngs_lanes.phix_in_lane" },
                        { data: "ngs_lanes.total_samples" },
                        { data: "ngs_lanes.resequenced",
			  "render": function (val, type, row) {
                    	  return val == 0 ? "No" : "Yes";
                	}	 },
                        { data: "ngs_lanes.notes" },
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
