            </aside><!-- /.right-side -->
        </div><!-- ./wrapper -->


        <script type="text/javascript" language="javascript" src="//code.jquery.com/jquery-1.11.1.min.js"></script> 
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js" type="text/javascript"></script>
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
                "ajax": "/dolphin/public/php/protocols.php",
                "table": "#protocols",
                "fields": [ {
                                "label": "Protocol Name:",
                                "name": "name"
                        }, {
                                "label": "Growth Protocol:",
                                "name": "growth"
                        }, {
                                "label": "Treatment Protocol:",
                                "name": "treatment"
                        }, {
                                "label": "Extract Protocol:",
                                "name": "extraction"
                        }, {
                                "label": "Library Construction Protocol:",
                                "name": "library_construction"
                        }, {
                                "label": "Library Strategy:",
                                "name": "library_strategy"
                        }
                ]
        } );

        $('#protocols').DataTable( {
                dom: "Tfrtip",
                ajax: "/dolphin/public/php/protocols.php",
                columns: [
                        { data: "name" },
                        { data: "growth" },
                        { data: "treatment" },
                        { data: "extraction" },
                        { data: "library_construction" },
                        { data: "library_strategy" },
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
