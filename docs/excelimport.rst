*********
Excel Import Guide
*********

This guide will walk you through the process of importing via the Excel Import page

Getting Started
===============

First, make sure to have an instance of dolphin available (see Dolphin Docker) as well as an account for the dolphin interface.

Once logged in, click on the 'NGS Tracking' tab on the left, then click on 'Excel Import'.

From here, under the 'Excel file input' button, there is a link to download an example excel input.  Download the example file and you'll be ready to start adding your data.

Filling Out the Excel File
==========================

The example spreadsheet already contains faux information to give users some context to the information they will be replacing.

Certain header cells within the spreadsheet are marked with a red arrow on the top right of the cell.  Hovering over these cells with your mouse will give you more details on what each row or column that they demark should include.

**META-DATA:**

The first tab of the spreadsheet is the Metadata tab.  This tab will reference to specific information about the experiment series at hand.

This tab will ask for information on:

*title:* The unique title of the Experiment Series

*summary:* Detailed description of the goals/objectives of the Experiment Series

*overall design:* Describe the design details of the Experiment Series

*organization:* The organization behind the project

*lab:* The lab within the organization

*contributor:* First name, Initial, Last name.  You may add additional contributors by creating more 'contributor' cells in the A column with the actual contributors in the B column.

*fastq directory:* Location within the cluster/host machine where the fastq files for this submission are stored.

*backup directory:* Location in which backups for the results should be stored within the cluster/host machine.

*amazon bucket:* Amazon bucket link for amazon backup storage.

This is the only tab that will ask for information in a single column (column B).  The rest of the tabs will ask for information in rows.

Note that to add additional Imports/Samples to an already exsisting Experiment Series, the information about the experiment must be identical to that you are adding to.
Fastq directory, backup directory, and amazon bucket does not have to be identical for each submission.

**LANES:**

The Lanes tab will contain information about lanes/imports of the samples being submitted.

There can be multiple lanes/imports within this tab, each one residing on it's own row.

Information on lanes/imports include:

*Lane Name:* The name of the lane/import being submitted.

*Sequencing id:* The id from the sequencing facility.

*Sequencing facility:* Location of where sequencing took place.

*Cost:* The cost of the sequencing.

*Date submitted:* Date of request for sequencing.

*Date received:* Date of sequencing results.

*% PhiX requested:* The requested amount of PhiX in lane.

*% PhiX in lane:* Actual amount of PhiX in lane.

*# of Samples:* Number of samples within lane.

*Resequenced?:*  Was this lane resequenced?

*Notes:* Additional notes about this lane.

Please note that lane name and sequencing id are required for submission.

**PROTOCOLS:**

The Protocols tab will contain information about the specific protocols used within the submission.

There can be multiple protocols within this tab, each one residing on it's own row.

Protocol information includes:

*protocol name:* The name of the protocol.

*growth protocol:* Protocols used to grow the organism/cells.

*extract protocol:* Protocols used to extract/prepare the sequenced material.

*library construction protocol:* Library contruction protocol.

*crosslinking method:* The crosslinking method if any.

*fragmentation method:* The fragmentation method if any.

*strand-specific:* Is this protocol strand specific?

*library strategy:* Sequencing techniques of this library.

Please note that protocol name is required for submission.

**SAMPLES:**

The Samples tab will contain information about the samples within the submission.

There can be multiple samples within this tab, each one residing on it's own row.

Sample information includes:

*Sample name:* The name of the sample.

*Lane name:* The name of the lane in which the sample resides.  This lane must be present in the Lanes tab.

*Protocol name:* The name of the protocol in which the sample used. This protocol must be present in the Protocols tab.

*barcode:* This samples barcode.

*title:* Descriptive title for the sample.

*batch id:* This samples batch id.

*source symbol:* Symbol used for the Source.  Symbol is a 4 character string.

*source:* Brief description of cell line, biological material, or tissue.

*organism:* List the organism from which this sample came from.

*biosample type:* Type of biosample, ie. in vitro.

*molecule:* Type of molecule extracted from the sample.

*description:* Added information that pertains to other fields.

*instrument model:* Sequencing instrument used.

*average insert size:* Average paired-end insert size.

*read length:* The length of the reads.

*Genotype:* The genotype of the sample.

*Condition Symbol:* Symbols representing the conditions from the condition column.  Multiple condition symbols may be present if multiple conditions match the symbols and they are comma separated.

*Condition:* Specific condition(s) pertaining to the sample.  Multiple conditions may be present as long as they are comma separated.

*concentration:* Concentration of Conditions.

*treatment manufacturer:* Manufacturer of treatments.

*Donor:* Name of sample donor, Typically in the D## format.

*Time:* Time (in minutes) post treatment.

*Biological Replica:* Biological replica number.

*Technical Replica:* Technical Replica number.

*spikeins:* Yes or No based on if spike-ins were introduced into the sample.

*3' Adapter sequence:*  3' Adapter sequence if present.

*Notebook reference:* Reference notebook information.

*notes:*  Any other additional notes for the sample.

*characteristics: newtag:* Biosource characteristic.

*characteristics: tag:* Biosource characteristic.

Please note that Sample name must be present and the Lane name and Protocol name must match one provided in their respected tabs.

**FILES:**

The Files tab will hold the files associated with either lanes or samples.

There can be multiple entries on this tab, as well as multiple entries per lane or sample.

File information includes:

*Sample or Lane Name (Enter same name for multiple files):* The sample or lane name.  These names must be within there respected tabs.

*file name(comma separated for paired ends):* The file fastq file name.  If paired end, list both files seperated by a comma.
