<?php
//session_start();
class v01 extends Controller
{
  public function index(){
    echo "API v1.0";
  }

  public function home_register(){
    $sql="SELECT COUNT(id) FROM leads WHERE phone_code=:phone_code AND phone_number=:phone_number ";
    $query=$this->db->prepare($sql);
    $query->bindParam(':phone_code',$_POST['phone_code']);
    $query->bindParam(':phone_number',$_POST['phone_number']);
    $query->execute();
    if ($query->fetchColumn()>0) {
      echo json_encode(array('success' =>false));
      return;
    }
    $sql ="INSERT INTO leads(first_name,last_name,source,phone_number,phone_code) 
                      VALUES(:first_name,:last_name,:source,:phone_number,:phone_code)";
    $query = $this->db->prepare($sql);
    $query->bindParam(':first_name',$_POST['first_name']);
    $query->bindParam(':last_name',$_POST['last_name']);
    $query->bindParam(':source',$_POST['source']);
    $query->bindParam(':phone_number',$_POST['phone_number']);
    $query->bindParam(':phone_code',$_POST['phone_code']);
    if ($query->execute()) {
      echo json_encode(array('success' =>true));
    }
  }

  public function register(){
  	$ip = $_SERVER['HTTP_CLIENT_IP']?$_SERVER['HTTP_CLIENT_IP']:($_SERVER['HTTP_X_FORWARDE‌​D_FOR']?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']);
    $sql="SELECT COUNT(id) FROM leads_full WHERE phone_code=:phone_code AND phone_number=:phone_number ";
    $query=$this->db->prepare($sql);
    $query->bindParam(':phone_code',$_POST['phone_code']);
    $query->bindParam(':phone_number',$_POST['phone_number']);
    $query->execute();
    if ($query->fetchColumn()>0) {
      echo json_encode(array('success' =>false));
      return;
    }
    $sql ="INSERT INTO leads_full(first_name,last_name,phone_code,phone_number,source,email,country,ip) 
                      VALUES(:first_name,:last_name,:phone_code,:phone_number,:source,:email,:country,:ip)";
    $query = $this->db->prepare($sql);
    $query->bindParam(':first_name',$_POST['first_name']);
    $query->bindParam(':ip',$ip);
    $query->bindParam(':last_name',$_POST['last_name']);
    $query->bindParam(':phone_code',$_POST['phone_code']);
    $query->bindParam(':phone_number',$_POST['phone_number']);
    $query->bindParam(':country',$_POST['country']);
    $query->bindParam(':email',$_POST['email']);
    $query->bindParam(':source',$_POST['source']);
    if ($query->execute()) {
      echo json_encode(array('success' =>true));
    }
  }

  public function requestCall(){
    $sql ="INSERT INTO requestCall(phone_number) VALUES(:phone_number)";
    $query = $this->db->prepare($sql);
    $query->bindParam(':phone_number',$_POST['phone_number']);
    if ($query->execute()) {
      echo json_encode(array('success' =>true));
    }
  }

  public function dontMiss(){
    $sql ="INSERT INTO dont_miss(name,phone_number) VALUES(:name,:phone_number)";
    $query = $this->db->prepare($sql);
    $query->bindParam(':name',$_POST['name']);
    $query->bindParam(':phone_number',$_POST['phone_number']);
    if ($query->execute()) {
      echo json_encode(array('success' =>true));
    }
  }



   public function getData(){
   	if (isset($_REQUEST['s'])) {
	   	if ($_REQUEST['s']!='ses') {
			echo  'hehehe';
			return;
		}
   	} else{
   		 echo 'hehehe';
   		 return;
   	}
   	echo("<br/>------------------LEADS--------------------------<br/>");
    $sql ="SELECT * FROM leads_full order by id desc";
    $query = $this->db->prepare($sql);
    $query->execute();
	while ($row=$query->fetch(PDO::FETCH_ASSOC)) { 
		foreach ($row as $r) {
			echo $r.'<br/>';
		}
		echo("<br/>");
	}

    echo("<br/>-------------------Dont Miss-------------------------<br/>");
 	$sql ="SELECT * FROM dont_miss order by id desc";
    $query = $this->db->prepare($sql);
    $query->execute();
	while ($row=$query->fetch(PDO::FETCH_ASSOC)) { 
		foreach ($row as $r) {
			echo $r.'<br/>';
		}
		echo("<br/>");
	}

	echo("<br/>-------------------Request Call--------------------------<br/>");
 	$sql ="SELECT * FROM requestCall order by id desc";
    $query = $this->db->prepare($sql);
    $query->execute();
	while ($row=$query->fetch(PDO::FETCH_ASSOC)) { 
		foreach ($row as $r) {
			echo $r.'<br/>';
		}
		echo("<br/>");
	}

  }
  
}
