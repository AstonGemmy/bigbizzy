
<?php
  /**
   * Populate MySQL Table Using faker
   * 
   * @author muni <muni@smarttutorials.net>
   */
  require_once('../vendor/autoload.php');
  
  try{
    $count = 5;
    //Connecting MySQL Database
    $pdo  = new PDO('mysql:host=localhost;dbname=bigbizzy', 'root', '@kleezpass01', array(
      PDO::ATTR_PERSISTENT => true
    ));
    $pdo->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );

    $seeder = new \tebazil\dbseeder\Seeder($pdo);
    $generator = $seeder->getGeneratorConfigurator();
    $faker = $generator->getFakerConfigurator();

    // $stmt = $pdo->prepare("SET FOREIGN_KEY_CHECKS=0");
    $stmt->execute();

    $seeder->table('sellers_data')->columns([
      'business_category' => $faker->text(15),
      'state' => $faker->text(15),
      'business_name' => $faker->unique()->text(20),
      'region' => $faker->text(15),
      'keywords' => $faker->text(100),
      'ceo_name' => $faker->unique()->firstName,
      'ceo_profile_picture' => $faker->text(15),
      'ceo_phone_no' => $faker->unique()->text(15),
      'business_address' => $faker->text(15),
      'business_image' => $faker->text(15),
      'business_overview' => $faker->text(15),
      'business_email' => $faker->unique()->email,
      'website' => $faker->text(15),
    ])->rowQuantity( $count );

    $seeder->refill();

    // $stmt = $pdo->prepare("SET FOREIGN_KEY_CHECKS=1");
    $stmt->execute();

} catch(Exception $e){
  echo '<pre>';print_r($e);echo '</pre>';
}