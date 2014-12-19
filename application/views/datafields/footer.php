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
                "ajax": "/dolphin/public/php/ajax/datafields.php",
                "table": "#datafields",
                "fields": [ {
                                "label": "Datatable:",
                                "name": "datafields.datatable_id",
                                "type": "select",
                        }, {
                                "label": "Table Name:",
                                "name": "datafields.tablename",
                        }, {
                                "label": "Field Name:",
                                "name": "datafields.fieldname",
                        }, {
                                "label": "title:",
                                "name": "datafields.summary",
                        }, {
                                "label": "Type:",
                                "name": "datafields.type",
                        }, {
                                "label": "Len:",
                                "name": "datafields.len",
                        }, {
                                "label": "Joined Table Name:",
                                "name": "datafields.joinedtablename",
                        }, {
                                "label": "Joined Field ID Name:",
                                "name": "datafields.joinedfieldidname",
                        }, {
                                "label": "Joined Target Field:",
                                "name": "datafields.joinedtargetfield",
			}
                ]
        } );

        $('#datafields').DataTable( {
                dom: "Tfrtip",
                ajax: "/dolphin/public/php/ajax/datafields.php",
                columns: [
                        { data: "datatables.mainmysql_table" },
                        { data: "datafields.tablename" },
                        { data: "datafields.fieldname" },
                        { data: "datafields.title" },
                        { data: "datafields.summary" },
                        { data: "datafields.type" },
                        { data: "datafields.len" },
                        { data: "datafields.joinedtablename" },
                        { data: "datafields.joinedfieldidname" },
                        { data: "datafields.joinedtargetfield" },
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
