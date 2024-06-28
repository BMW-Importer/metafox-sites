pipeline{  
  agent any 
  stages{ 
    stage('Build Application') {  
        steps { 
	  sh 'mvn clean install' 
        } 
    } 
    stage('SonarQube Analysis') {
	environment { 
	  SONAR_METAFOX_SITES_TOKEN = credentials(sonar_metafox_sites')
	}
        steps {
          script {
		def scannerHome = tool 'SonarQube';
                withSonarQubeEnv('SonarQube') {
                 sh """
                       ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=Metafox-sites \
			-Dsonar.sources=blocks \
                        -Dsonar.projectName=Metafox-sites \
			-Dsonar.host.url=http://172.31.18.42:9000/ \
			-Dsonar.login=${SONAR_METAFOX_SITES_TOKEN} \
                        -Dsonar.sourceEncoding=UTF-8 
                        """
                  }
        	}
            }
    }     
  }  
}	
