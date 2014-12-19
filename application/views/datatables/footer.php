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
                "ajax": "/dolphin/public/php/ajax/datatables.php",
                "table": "#datatables",
                "fields": [ {
                                "label": "Name:",
                                "name": "name",
                        }, {
                                "label": "Parent Name:",
                                "name": "parent_name",
                        }, {
                                "label": "Parent Link:",
                                "name": "parent_link",
                        }, {
                                "label": "Ajax:",
                                "name": "ajax",
                        }, {
                                "label": "Datatable Name:",
                                "name": "datatable_name",
                        }, {
                                "label": "Main mySQL Table:",
                                "name": "mainmysql_table",
                        }, {
                                "label": "Joined?:",
                                "name": "joined",
				"type":  "radio",
                                "options": [
                                { label: "No", value: 0 },
                                { label: "Yes",  value: 1 }
                                ],
                                "default": 0,
			}
                ]
        } );

        $('#datatables').DataTable( {
                dom: "Tfrtip",
                ajax: "/dolphin/public/php/ajax/datatables.php",
                columns: [
                        { data: "name" },
                        { data: "parent_name" },
                        { data: "parent_link" },
                        { data: "ajax" },
                        { data: "datatable_name" },
                        { data: "mainmysql_table" },
                        { data: "joined" ,
                          "render": function (val, type, row) {
                          return val == 0 ? "No" : "Yes";
                        }        },
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
