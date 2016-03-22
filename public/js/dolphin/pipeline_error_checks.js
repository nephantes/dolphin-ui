/*
 *	pipeline_error_checks.js
 *	
 *	Storage of pipeline error check functions.
 *
 *	Functions consist of:
 *		- generating pipeline creation checks
 *		- generation of submission checks
 *		- creation of error output
 */

//	START GLOBAL VARIABLES

//	END GLOBAL VARIABLES


//	START GENERIC FUNCTIONS

function displayErrorModal(modal, message){
	//	If modal string passed isn't jquery
	if (modal.substring(0,1) != '#') {
		modal = '#' + modal;
	}
	$(modal).modal({
		show: true
	});
	document.getElementById('errorLabel').innerHTML = message;
	document.getElementById('errorAreas').innerHTML = '';
}

function checkPipelineExists(num, type){
	var check = false;
	if (currentPipelineVal.indexOf(type) > -1){
		check = true;
	}
	return check;
}

function checkPipelineDoesNotExist(num, type) {
	var check = false;
	if (currentPipelineVal.indexOf(type) == -1){
		check = true;
	}
	return check;
}

function checkPipelineUpstream(num, type){
	var check = false;
	if (currentPipelineID[currentPipelineVal.indexOf(type)] < num){
		check = true;
	}
	return check;
}

function checkPipelineDownstream(num, type){
	var check = false;
	if (currentPipelineID[currentPipelineVal.indexOf(type)] > num){
		check = true;
	}
	return check;
}

function checkPipelineReplacing(num, type){
	var check = false
	if (currentPipelineID[currentPipelineVal.indexOf(type)] == num) {
		check = true;
	}
	return check;
}

function checkPipelineVariableDependency(num, type, id){
	var check = false;
	//	Checkbox Check
	if (id.indexOf('check') > -1) {
		if (document.getElementById(id).checked == false) {
			check = true;
		}
	}
	return check;
}

//	END GENERIC FUNCTIONS
//	************************************************************************
//	START GROUPED FUNCTIONS

function pipelineSelectCheck(num, type){
	//	RSEM
	if (type == 'RNASeqRSEM') {
		//	If a RSEM pipeline already exists
		if(checkPipelineExists(num, type)){
			displayErrorModal('#errorModal', 'You cannot select more than one RSEM pipeline');
			return true;
		}
	//	Tophat
	}else if (type == 'Tophat') {
		//	If a Tophat pipeline already exists
		if(checkPipelineExists(num, type)){
			displayErrorModal('#errorModal', 'You cannot select more than one Tophat pipeline');
			return true;
		}
	//	ChipSeq
	}else if (type == 'ChipSeq') {
		//	If a ChipSeq pipeline already exists
		if(checkPipelineExists(num, type)){
			displayErrorModal('#errorModal', 'You cannot select more than one ChipSeq pipeline');
			return true;
		}
	//	DESeq
	}else if (type == 'DESeq') {
		//	RSEM pipeline must be present
		if(checkPipelineDoesNotExist(num, 'RNASeqRSEM')){
			displayErrorModal('#errorModal', 'DESeq requires a RSEM pipeline to run');
			return true;
		//	RSEM must run before DESeq
		}else if (checkPipelineDownstream(num, 'RNASeqRSEM')) {
			displayErrorModal('#errorModal', 'You must run a RSEM pipeline before you can run DESeq');
			return true;
		//	If DESeq is replacing RSEM
		}else if (checkPipelineReplacing(num, 'RNASeqRSEM')) {
			displayErrorModal('#errorModal', 'DESeq requires a RNASeqRSEM pipeline to run');
			return true;
		}
	//	BisulphiteMapping
	}else if (type == 'BisulphiteMapping') {
		//	If a BisulphiteMapping pipeline already exists
		if(checkPipelineExists(num, type)){
			displayErrorModal('#errorModal', 'You cannot select more than one BisulphiteMapping pipeline');
			return true;
		}
	}else if (type == 'DiffMeth') {
		//	BisulphiteMapping pipeline must be present
		if(checkPipelineDoesNotExist(num,  'BisulphiteMapping')){
			displayErrorModal('#errorModal', 'DiffMeth requires a BisulphiteMapping pipeline to run');
			return true;
		//	BisulphiteMapping must run before BisulphiteMapping
		}else if (checkPipelineDownstream(num, 'BisulphiteMapping')) {
			displayErrorModal('#errorModal', 'You must run a BisulphiteMapping pipeline before you can run DiffMeth');
			return true;
		//	If DiffMeth is replacing BisulphiteMapping
		}else if (checkPipelineReplacing(num, 'BisulphiteMapping')) {
			displayErrorModal('#errorModal', 'DiffMeth requires a BisulphiteMapping pipeline to run');
			return true;
		}
	}else if (type == 'HaplotypeCaller') {
		//	If a HaplotypeCaller pipeline already exists
		if(checkPipelineExists(num, type)){
			displayErrorModal('#errorModal', 'You cannot select more than one HaplotypeCaller pipeline');
			return true;
		//	Tophat/ChipSeq must run before DESeq
		}else{
			var tophat_check = checkPipelineDoesNotExist(num, 'Tophat') || checkPipelineDownstream(num, 'Tophat') || checkPipelineReplacing(num, 'Tophat');
			var chipseq_check = checkPipelineDoesNotExist(num, 'ChipSeq') || checkPipelineDownstream(num, 'ChipSeq') || checkPipelineReplacing(num, 'ChipSeq');
			if (tophat_check && chipseq_check) {
				displayErrorModal('#errorModal', 'You must run a Tophat or ChipSeq pipeline before you can run HaplotypeCaller');
				return true;
			}
		}
	}
	return false;
}

function pipelineSubmitCheck(){
	
}

//	END GROUPED FUNCTIONS