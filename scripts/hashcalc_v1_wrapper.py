from sys import argv, exit, stderr
from os import system
from os.path import dirname, exists, join

bin_dir = dirname(argv[0])
cmd = '/project/umw_biocore/bin/runWorkflow.py -i %(configuration)s.input -w %(workflow)s -p /project/umw_biocore/bin/workflow/scripts/tools/workflows/HashCalc_v1_default.txt -u %(username)s -o %(output_dir)s'

def main() :
	configuration = argv[1] #Kraken default configuration file
	input = argv[2] #input dir in cluster
	fastq_dir = argv[3] #input dir in cluster
	output_dir = argv[4] #output dir in cluster
	user_email = argv[5] #designated by Galaxy

	configuration = configuration.strip()
	input = input.strip()
	output_dir = output_dir.strip()

	if not configuration :
		print >>stderr, 'Error: Configuration is NULL.'
		exit(128)

	if not input :
		print >>stderr, 'Error: Input is NULL.'
		exit( 128 )

	if not output_dir :
		print >>stderr, 'Error: Output_dir is NULL.'
		exit( 128 )

	if user_email :
		username = user_email.split('@')[0]
	else :
		print >>systderr, 'Error: User email is NULL.'
		exit( 128 )

	write_input( fastq_dir, input, configuration )
	workflow = join( bin_dir, 'hashcalc_workflow.txt' )
        runscript = cmd % locals()
        print runscript
	retval = system( runscript )
	exit(retval)

def write_input( fastq_dir, input, configuration ) :
	fp = open( configuration + ".input", 'w' )
	print >>fp, '@INPUT=%s'%input
	print >>fp, '@FASTQDIR=%s'%fastq_dir
	fp.close()


if __name__ == '__main__' :
	main()
