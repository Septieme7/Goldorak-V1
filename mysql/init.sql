-- Création de la base de données (si elle n'existe pas)
CREATE DATABASE IF NOT EXISTS goldorak_db;
USE goldorak_db;
SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

-- --------------------------------------------------------
-- Table `personnages`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `personnages`;
CREATE TABLE `personnages` (
                               `id` int NOT NULL AUTO_INCREMENT,
                               `nom_fr` varchar(100) NOT NULL,
                               `nom_jp` varchar(100) DEFAULT NULL,
                               `role` varchar(100) DEFAULT NULL,
                               `faction` varchar(50) DEFAULT NULL,
                               `age` int DEFAULT NULL,
                               `description` text,
                               PRIMARY KEY (`id`),
                               KEY `idx_personnages_nom` (`nom_fr`),
                               KEY `idx_personnages_faction` (`faction`)
) ENGINE=InnoDB DEFAULT  CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `personnages` (`id`, `nom_fr`, `nom_jp`, `role`, `faction`, `age`, `description`) VALUES
                                                                                                  (1,'Actarus','Daisuke Umon','Pilote de Goldorak','Terre',20,'Prince de la planète Euphor, exilé sur Terre après la destruction de son monde. Sous l\'identité d\'Actarus, il pilote Goldorak pour protéger la Terre contre l\'empire de Véga. Jeune homme courageux, noble et déterminé, il possède des pouvoirs télépathiques limités et une force physique exceptionnelle.'),
                                                                                                  (2,'Vicky','Hikaru Makiba','Fiancée d\'Actarus','Terre',18,'Fille du professeur Procyon et fiancée d\'Actarus. Jeune femme douce, courageuse et déterminée qui apporte un soutien émotionnel crucial à Actarus. Malgré les dangers, elle reste toujours à ses côtés et participe activement à la résistance contre les forces de Véga.'),
                                                                                                  (3,'Méphisto','Koji Kabuto','Pilote du Machiner','Terre',25,'Pilote du robot Machiner Garland et scientifique brillant. Ami proche d\'Actarus, il apporte un soutien technique et stratégique essentiel dans les combats contre les Véga. Calme, réfléchi et extrêmement intelligent, il est souvent le cerveau derrière les opérations.'),
                                                                                                  (4,'Duke Fleed','Prince Duke Fleed','Pilote du Sabre Noir','Terre',22,'Prince de la planète Fleed et frère cadet d\'Actarus. Pilote du robot Sabre Noir, il apparaît d\'abord comme un rival de Goldorak avant de devenir un allié précieux. Jeune homme fier, impulsif mais au cœur noble, en quête de reconnaissance.'),
                                                                                                  (5,'Prof. Procyon','Genzo Umon','Scientifique','Terre',60,'Scientifique de génie, père de Vicky. C\'est lui qui a découvert Goldorak caché sur Terre et l\'a restauré. Conseiller scientifique et stratégique de l\'équipe, il développe les technologies et les stratégies pour contrer les attaques Véga.'),
                                                                                                  (6,'Minos','Taro','Ami/Mécanicien','Terre',30,'Mécanicien de talent et ami fidèle d\'Actarus. Il s\'occupe de l\'entretien du Spacer, de Goldorak et des autres équipements. Personnage chaleureux, dévoué et toujours prêt à aider, il apporte une touche d\'humour et d\'humanité au groupe.'),
                                                                                                  (7,'Roi Vega','King Vega','Antagoniste principal','Véga',97,'Souverain suprême de l\'empire de Véga, également appelé Grand Marshal. Chef tyrannique, impitoyable et obsédé par la conquête de l\'univers. Il dirige ses armées depuis la Planète Fleur avec une main de fer, sans compassion pour ses ennemis ni son propre peuple.'),
                                                                                                  (8,'Grand Marshal / Roi Véga','ベガ大王 (Vega Daiō)','Chef suprême de l\'empire de Véga','Véga',99,'Dirigeant suprême de l\'empire de Véga. Antagoniste principal de la série, il cherche à conquérir la Terre pour ses ressources. Commandant depuis son vaisseau-mère, il envoie une armée de robots et de monstres pour soumettre la planète bleue.'),
                                                                                                  (9,'Prince de Rigel','リゲル司令 (Rigeru Shirei)','Commandant militaire','Véga',99,'Commandant militaire de haut rang dans les forces de Véga. Stratège impitoyable et efficace, il mène personnellement de nombreuses attaques contre la Terre. Loyal envers le Roi Vega, il n\'hésite pas à sacrifier ses troupes pour la victoire.'),
                                                                                                  (10,'Hydargos','ヒダル司令 (Hidaru Shirei)','Commandant militaire','Véga',99,'Général des armées Véga, commandant redoutable et sans pitié. Il dirige de nombreuses offensives contre Goldorak et fait preuve d\'une hargne particulière. Ambitieux et cruel, il cherche à prouver sa valeur pour monter en grade dans la hiérarchie Véga.'),
                                                                                                  (11,'Rubina','ルビナ司令 (Rubina Shirei)','Commandant scientifique','Véga',98,'Commandant scientifique de Véga. Spécialiste en technologies avancées et en création de robots de combat. Froid, calculateur et méthodique, il conçoit des armes de plus en plus sophistiquées pour vaincre Goldorak, préférant la ruse à la force brute.'),
                                                                                                  (12,'Grand Ancêtre','大先輩 (Daisempai)','Esprit maléfique dirigeant','Véga',98,'Esprit maléfique ancestral qui dirige secrètement l\'empire de Véga. Source du pouvoir occulte et de la technologie avancée des Véga. Entité mystérieuse qui influence les décisions du Roi Vega depuis l\'ombre, cherchant à répandre le chaos dans l\'univers.'),
                                                                                                  (21,'Grand Stratégor','大司令 (Dai-Shirei)','Commandant suprême des forces Véga','Véga',NULL,'Commandant en chef basé sur la Planète Fleur'),
                                                                                                  (22,'Princesse Aphrodia','アフロディア姫 (Afurodia-hime)','Princesse et commandante Véga','Véga',25,'Princesse de Vega qui finit par trahir son peuple'),
                                                                                                  (23,'Floga','フロガ (Furoga)','Commandant des forces de Floga','Floga',NULL,'Nouvel ennemi apparu à la fin de la série'),
                                                                                                  (32,'Général Dargol','ダルゴル将軍 (Darugoru Shōgun)','Général des armées Véga','Véga',40,'Général important des forces de Vega');

-- --------------------------------------------------------
-- Table `robots`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `robots`;
CREATE TABLE `robots` (
                          `id` int NOT NULL AUTO_INCREMENT,
                          `nom_fr` varchar(100) NOT NULL,
                          `nom_jp` varchar(100) DEFAULT NULL,
                          `pilote_id` int DEFAULT NULL,
                          `description` text,
                          `type_robot` varchar(50) DEFAULT NULL,
                          `hauteur` decimal(5,2) DEFAULT NULL,
                          `poids` decimal(10,2) DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          KEY `idx_robots_pilote` (`pilote_id`),
                          KEY `idx_robots_nom` (`nom_fr`),
                          CONSTRAINT `robots_ibfk_1` FOREIGN KEY (`pilote_id`) REFERENCES `personnages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `robots` (`id`, `nom_fr`, `nom_jp`, `pilote_id`, `description`, `type_robot`, `hauteur`, `poids`) VALUES
                                                                                                                  (1,'Goldorak','Grendizer',1,'Robot le plus puissant de l\'univers, venu d\'Euphor','Robot transformable',45.00,550.00),
                                                                                                                  (2,'Sabre Noir','Black Sar',4,'Robot rival de Goldorak, piloté par Duke Fleed','Robot de combat',40.00,500.00),
                                                                                                                  (3,'Machiner','Machine Garland',3,'Robot de soutien rouge, agile et rapide','Robot de soutien',35.00,300.00),
                                                                                                                  (4,'Dragon No.1','ドラゴン１号 (Doragon Ichigō)',8,'Robot dragon rouge, un des premiers envoyés sur Terre','Robot de combat',30.00,400.00),
                                                                                                                  (5,'Gomoras','ゴモラス (Gomorasu)',8,'Robot reptile bipède, modèle standard de Véga','Robot de combat',30.00,400.00),
                                                                                                                  (6,'Gomora S','ゴモラS (Gomora S)',8,'Version spatiale du Gomoras','Robot de combat',30.00,400.00),
                                                                                                                  (7,'Garan','ガラン (Garan)',8,'Robot à l\'apparence d\'insecte géant','Robot de combat',30.00,400.00),
                                                                                                                  (8,'Gedon','ゲドン (Gedon)',8,'Robot massif à la force colossale','Robot de combat',30.00,400.00),
                                                                                                                  (9,'Gorba','ゴルバ (Goruba)',8,'Robot équipé de bras-pinces','Robot de combat',30.00,400.00),
                                                                                                                  (10,'Bazela','バゼラ (Bazera)',8,'Robot équipé d\'une épée et d\'un bouclier','Robot de combat',30.00,400.00),
                                                                                                                  (11,'Gomora H','ゴモラH (Gomora H)',9,'Version personnelle d\'Hydargos du Gomora','Robot de combat',30.00,400.00),
                                                                                                                  (12,'Gadora H','ガドラH (Gadora H)',9,'Version personnelle d\'Hydargos du Gadora','Robot de combat',30.00,400.00),
                                                                                                                  (13,'Guella H','ゲラH (Gera H)',9,'Version personnelle d\'Hydargos du Guella','Robot de combat',30.00,400.00),
                                                                                                                  (14,'Gomora R','ゴモラR (Gomora R)',10,'Version personnelle de Rubina du Gomora','Robot de combat',30.00,400.00),
                                                                                                                  (15,'Gadora R','ガドラR (Gadora R)',10,'Version personnelle de Rubina du Gadora','Robot de combat',30.00,400.00),
                                                                                                                  (16,'Guella R','ゲラR (Gera R)',10,'Version personnelle de Rubina du Guella','Robot de combat',30.00,400.00),
                                                                                                                  (17,'Gadora','ガドラ (Gadora)',8,'Robot à l\'apparence de chauve-souris géante','Robot de combat',30.00,400.00),
                                                                                                                  (18,'Guella','ゲラ (Gera)',8,'Robot amphibie spécialisé','Robot de combat',30.00,400.00),
                                                                                                                  (19,'King Gomora','キングゴモラ (Kingu Gomora)',8,'Version royale du Gomora','Robot de combat',30.00,400.00),
                                                                                                                  (20,'King Gadora','キングガドラ (Kingu Gadora)',8,'Version royale du Gadora','Robot de combat',30.00,400.00),
                                                                                                                  (21,'King Bazela','キングバゼラ (Kingu Bazera)',8,'Version royale du Bazela','Robot de combat',30.00,400.00),
                                                                                                                  (22,'Gandal','ガンダル (Gandaru)',8,'Premier robot géant Véga envoyé sur Terre, tête de cheval','Robot Géant',38.00,420.00),
                                                                                                                  (23,'Bongo','ボンゴ (Bongo)',8,'Robot massif avec un gros cerveau apparent et deux cornes','Robot Géant',42.00,480.00),
                                                                                                                  (24,'Gremade','グレメード (Guremēdo)',8,'Robot agile avec une tête pointue et des armes sur les bras','Robot Géant',36.00,380.00),
                                                                                                                  (25,'Gromadan','グロマダン (Guromadan)',8,'Robot imposant avec une crête et des épaules larges','Robot Géant',40.00,450.00),
                                                                                                                  (26,'Gingulf','ギンガルフ (Gingarufu)',8,'Robot au design inspiré d\'un animal, avec une gueule menaçante','Robot Géant',39.00,430.00),
                                                                                                                  (27,'Granzer','グランザー (Guranzā)',8,'Robot puissant avec un design de démon, des ailes et une lance','Robot Géant',45.00,500.00),
                                                                                                                  (28,'Golgom','ゴルゴム (Gorugomu)',8,'Robot très résistant, ressemblant à un char d\'assaut','Robot Géant',41.00,470.00),
                                                                                                                  (29,'Guromaki','グロマキ (Guromaki)',8,'Robot au corps couvert de pics, capable de les projeter','Robot Géant',37.00,410.00),
                                                                                                                  (30,'Dogmar','ドグマー (Dogumā)',8,'Robot massif avec une tête qui évoque un casque de samouraï','Robot Géant',43.00,490.00),
                                                                                                                  (31,'Gardoll','ガルドル (Garudoru)',8,'Robot à l\'apparence d\'insecte géant','Robot Géant',39.00,440.00),
                                                                                                                  (32,'Zarion','ザリオン (Zarion)',23,'Principal robot de Floga, ennemi apparu à la fin de la série','Robot Géant',44.00,510.00),
                                                                                                                  (33,'Grandoll','グランドル (Gurandoru)',8,'Variante plus puissante du Gardoll','Robot Géant',41.00,460.00),
                                                                                                                  (34,'Grodan','グロダン (Gurodan)',8,'Robot spécialisé dans les attaques sismiques','Robot Géant',38.00,425.00),
                                                                                                                  (35,'DoSmethod','UnDosTres',2,'Le meilleurs et ï C tout.... le soleil brille le matin dans la camargues que faire pour le regarder sans ce faire mal aux yeux , suggestion mettre des lunettee C le mieux pour cela , faire et defaire des morceaux de code ma passion','Robot transformable',777.00,777.00);

-- --------------------------------------------------------
-- Table `armes`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `armes`;
CREATE TABLE `armes` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `nom_fr` varchar(100) NOT NULL,
                         `nom_jp` varchar(100) DEFAULT NULL,
                         `robot_id` int DEFAULT NULL,
                         `puissance` varchar(50) DEFAULT NULL,
                         `frequence_utilisation` enum('Très Fréquente','Fréquente','Occasionnelle','Assez Rare','Rare','Très Rare') DEFAULT NULL,
                         `description` text,
                         PRIMARY KEY (`id`),
                         KEY `idx_armes_robot` (`robot_id`),
                         CONSTRAINT `armes_ibfk_1` FOREIGN KEY (`robot_id`) REFERENCES `robots` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `armes` (`id`, `nom_fr`, `nom_jp`, `robot_id`, `puissance`, `frequence_utilisation`, `description`) VALUES
                                                                                                                    (1,'Double Hache','スペースサンダー (Supēsu Sandā)',1,'Très Haute','Très Fréquente','Lames d\'énergie projetées depuis les épaules'),
                                                                                                                    (2,'Missiles Ventraux','ベントラルミサイル (Bentoraru Misairu)',1,'Haute','Fréquente','Salves de missiles tirés depuis le torse'),
                                                                                                                    (3,'Lance-Flamme','ファイヤーブラスター (Faiyā Burasutā)',1,'Moyenne','Occasionnelle','Projection de flammes depuis la bouche'),
                                                                                                                    (4,'Rafale de Feu','ブレストバーン (Buresuto Bān)',1,'Haute','Occasionnelle','Rayon d\'énergie thermique depuis le poitrail'),
                                                                                                                    (5,'Fulguer Poing','ロケットパンチ (Roketto Panchi)',1,'Moyenne','Assez Rare','Poings propulsés sur l\'ennemi'),
                                                                                                                    (6,'Rayon Cosmo','パワーレイ (Pawā Rei)',1,'Ultime','Très Rare','Rayon d\'énergie concentrée depuis le front'),
                                                                                                                    (7,'Coup de Pied Sismique','ドリルプレッシャーキック (Doriru Puresshā Kikku)',1,'Très Haute','Rare','Onde de choc sismique via les pieds-forets'),
                                                                                                                    (10,'Épée Laser','レーザーソード',1,'Très Haute','Très Rare','Une épée émettant un rayon laser tranchant'),
                                                                                                                    (13,'Fouet Énergétique','エネルギー鞭 (Enerugī Muchi)',22,'Haute','Fréquente','Fouet composé d\'énergie pure'),
                                                                                                                    (14,'Lance Démoniaque','デーモンランス (Dēmon Ransu)',27,'Très Haute','Très Fréquente','Lance énergétique utilisée comme arme principale'),
                                                                                                                    (15,'Missiles Ailés','ウィングミサイル (Wingu Misairu)',27,'Moyenne','Occasionnelle','Missiles tirés depuis les ailes'),
                                                                                                                    (16,'Épée Laser Verte','緑のレーザーソード (Midori no Rēzā Sōdo)',32,'Très Haute','Fréquente','Épée laser de couleur verte, arme caractéristique de Floga');

-- --------------------------------------------------------
-- Table `vaisseaux`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `vaisseaux`;
CREATE TABLE `vaisseaux` (
                             `id` int NOT NULL AUTO_INCREMENT,
                             `nom_fr` varchar(100) NOT NULL,
                             `nom_jp` varchar(100) DEFAULT NULL,
                             `type_vaisseau` varchar(50) DEFAULT NULL,
                             `pilote_id` int DEFAULT NULL,
                             `description` text,
                             `faction` varchar(50) DEFAULT NULL,
                             PRIMARY KEY (`id`),
                             KEY `pilote_id` (`pilote_id`),
                             KEY `idx_vaisseaux_nom` (`nom_fr`),
                             CONSTRAINT `vaisseaux_ibfk_1` FOREIGN KEY (`pilote_id`) REFERENCES `personnages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `vaisseaux` (`id`, `nom_fr`, `nom_jp`, `type_vaisseau`, `pilote_id`, `description`, `faction`) VALUES
                                                                                                               (1,'Spacer','Spacer','Vaisseau de combat',1,'Vaisseau personnel d\'Actarus, multiple transformations','Terre'),
                                                                                                               (2,'Grand Spacer','Great Spacer','Vaisseau-mère',NULL,'Base mobile et atelier de réparation','Terre'),
                                                                                                               (3,'Spazer Char','Tank Spacer','Char d\'assaut',1,'Transformation terrestre du Spacer','Terre'),
                                                                                                               (4,'Spazer Sous-Marin','Dolphin Spacer','Submersible',1,'Transformation maritime du Spacer','Terre'),
                                                                                                               (5,'Véga No.1','ベガ１号 (Vega Ichigō)','Vaisseau-mère',7,'Vaisseau principal du Grand Marshal/Roi Véga','Véga'),
                                                                                                               (6,'Véga No.2','ベガ２号 (Vega Nigō)','Vaisseau-mère',8,'Vaisseau de commandement du Prince de Rigel','Véga'),
                                                                                                               (7,'Véga No.3','ベガ３号 (Vega Sangō)','Vaisseau-mère',9,'Vaisseau de commandement d\'Hydargos','Véga'),
                                                                                                               (8,'Véga No.4','ベガ４号 (Vega Yongō)','Vaisseau-mère',10,'Vaisseau de commandement de Rubina','Véga'),
                                                                                                               (9,'Véga No.5','ベガ５号 (Vega Gogō)','Croiseur de combat',NULL,'Croiseur standard de l\'armée de Véga','Véga'),
                                                                                                               (10,'Véga No.6','ベガ６号 (Vega Rokugō)','Croiseur de combat',NULL,'Croiseur standard de l\'armée de Véga','Véga'),
                                                                                                               (11,'Véga No.7','ベガ７号 (Vega Nanagō)','Croiseur de combat',NULL,'Croiseur standard de l\'armée de Véga','Véga'),
                                                                                                               (12,'Véga No.0','ベガ０号 (Vega Zerogō)','Vaisseau expérimental',7,'Vaisseau expérimental ultime de Véga','Véga'),
                                                                                                               (13,'Véga No.37','ベガ37号 (Vega Sanjūnana-gō)','Vaisseau de reconnaissance',NULL,'Vaisseau spécialisé dans la reconnaissance','Véga'),
                                                                                                               (14,'Véga No.38','ベガ38号 (Vega Sanjūhachi-gō)','Vaisseau de recherche',NULL,'Vaisseau de recherche scientifique','Véga'),
                                                                                                               (16,'Vaisseau d\'Aphrodia','アフロディア機 (Afurodia-ki)','Vaisseau de Commandement',22,'Vaisseau personnel de la princesse Aphrodia en forme d\'oiseau de proie','Véga'),
                                                                                                               (17,'Robot du Roi Vega','ベガ大王ロボ (Vega Daiō Robo)','Robot Personnel',7,'Robot personnel du Roi Vega dans le film La Grande Attaque de Vega','Véga'),
                                                                                                               (18,'Soucoupe Végan Type A','ベガ円盤A型 (Vega Enban A-gata)','Chasseur Spatial',NULL,'Chasseur spatial de base des forces Véga','Véga'),
                                                                                                               (19,'Soucoupe Végan Type B','ベガ円盤B型 (Vega Enban B-gata)','Bombardier',NULL,'Bombardier lourd des forces Véga','Véga'),
                                                                                                               (20,'Vaisseau-Mère Végan','ベガ母艦 (Vega Bokan)','Cuirassé Spatial',21,'Cuirassé spatial de commandement des forces Véga','Véga');

-- --------------------------------------------------------
-- Table `episodes`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `episodes`;
CREATE TABLE `episodes` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `numero_jp` int DEFAULT NULL,
                            `numero_fr` int DEFAULT NULL,
                            `titre_fr` varchar(200) NOT NULL,
                            `titre_jp` varchar(200) DEFAULT NULL,
                            `diffuse_jp` date DEFAULT NULL,
                            `diffuse_fr` date DEFAULT NULL,
                            `resume` text,
                            PRIMARY KEY (`id`),
                            KEY `idx_episodes_numero` (`numero_fr`,`numero_jp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `episodes` (`id`, `numero_jp`, `numero_fr`, `titre_fr`, `titre_jp`, `diffuse_jp`, `diffuse_fr`, `resume`) VALUES
                                                                                                                          (9,1,1,'Le justicier de l\'espace','発進! グレンダイザー','1975-10-05','1978-07-03',NULL),
                                                                                                                          (10,2,2,'Le monstre des mers','恐怖の海の怪獣','1975-10-12','1978-07-04',NULL),
                                                                                                                          (11,16,15,'Le monstre vampire','怪獣ウインダーあらわる','1976-01-25','1978-08-01',NULL),
                                                                                                                          (12,74,72,'Adieu Goldorak','永遠に輝けグレンダイザー','1977-02-27','1979-01-01',NULL),
                                                                                                                          (13,1,1,'Le justicier de l\'espace','発進! グレンダイザー','1975-10-05',NULL,NULL),
                                                                                                                          (14,2,2,'Le monstre des mers','恐怖の海の怪獣','1975-10-12',NULL,NULL),
                                                                                                                          (15,3,3,'L\'antre du monstre','怪獣島の決闘','1975-10-19',NULL,NULL),
                                                                                                                          (16,4,4,'Le vaisseau fantôme','ゆうれい船の恐怖','1975-10-26',NULL,NULL),
                                                                                                                          (17,5,5,'Le monstre des neiges','白銀の怪獣現わる','1975-11-02',NULL,NULL),
                                                                                                                          (18,6,6,'Le piège','怪獣の罠を破れ','1975-11-09',NULL,NULL),
                                                                                                                          (19,7,7,'Le monstre des marais','よみがえる湖の怪獣','1975-11-16',NULL,NULL),
                                                                                                                          (20,8,8,'L\'arme secrète','必殺! スペーサー攻擊','1975-11-23',NULL,NULL),
                                                                                                                          (21,9,9,'Le monstre des sables','灼熱の砂漠の怪獣','1975-11-30',NULL,NULL),
                                                                                                                          (22,10,10,'Le monstre des volcans','地底怪獣の挑戦','1975-12-07',NULL,NULL),
                                                                                                                          (23,11,11,'Double Hache','北極の大怪獣を倒せ','1975-12-14',NULL,NULL),
                                                                                                                          (24,12,12,'Le monstre des glaces','南極の大決闘','1975-12-21',NULL,NULL),
                                                                                                                          (25,13,13,'Le sous-marin de l\'enfer','海底基地を叩け','1975-12-28',NULL,NULL),
                                                                                                                          (26,14,14,'L\'île de la mort','怪獣島の決闘','1976-01-04',NULL,NULL),
                                                                                                                          (27,15,NULL,'Épisode non diffusé en France','さらばハンター機','1976-01-11',NULL,NULL),
                                                                                                                          (28,16,15,'Le monstre vampire','怪獣ウインダーあらわる','1976-01-18',NULL,NULL),
                                                                                                                          (29,17,16,'Le réveil du volcan','大爆発! 富士山','1976-01-25',NULL,NULL),
                                                                                                                          (30,18,17,'Le monstre des marécages','怪獣ゴースを倒せ!','1976-02-01',NULL,NULL),
                                                                                                                          (31,19,18,'Le monstre des neiges','白い悪魔の恐怖','1976-02-08',NULL,NULL),
                                                                                                                          (32,20,19,'Le monstre des glaces','北海の大激闘','1976-02-15',NULL,NULL),
                                                                                                                          (33,21,20,'Le monstre des forêts','緑の怪獣の恐怖','1976-02-22',NULL,NULL),
                                                                                                                          (34,22,21,'Le monstre des cavernes','地底怪獣大作戦','1976-02-29',NULL,NULL),
                                                                                                                          (35,23,22,'Le monstre des abîmes','南海の大怪獣','1976-03-07',NULL,NULL),
                                                                                                                          (36,24,23,'Le monstre de feu','炎の怪獣を倒せ!','1976-03-14',NULL,NULL),
                                                                                                                          (37,25,24,'Le monstre solaire','太陽怪獣の挑戦','1976-03-21',NULL,NULL),
                                                                                                                          (38,26,25,'Le monstre lunaire','月怪獣現わる!','1976-03-28',NULL,NULL),
                                                                                                                          (39,27,26,'L\'étoile de la mort','宇宙よりの挑戦','1976-04-04',NULL,NULL),
                                                                                                                          (40,28,27,'Le monstre magnétique','磁力怪獣の罠','1976-04-11',NULL,NULL),
                                                                                                                          (41,29,28,'Le monstre des ténèbres','暗黒怪獣の恐怖','1976-04-18',NULL,NULL),
                                                                                                                          (42,30,29,'Le monstre météore','流れ星怪獣の恐怖','1976-04-25',NULL,NULL),
                                                                                                                          (43,31,30,'Le monstre miroir','鏡怪獣の魔力','1976-05-02',NULL,NULL),
                                                                                                                          (44,32,31,'Le monstre des profondeurs','深海怪獣を倒せ!','1976-05-09',NULL,NULL),
                                                                                                                          (45,33,32,'Le monstre aérien','大空の大決闘','1976-05-16',NULL,NULL),
                                                                                                                          (46,34,33,'Le monstre des récifs','珊瑚怪獣の恐怖','1976-05-23',NULL,NULL),
                                                                                                                          (47,35,34,'Le monstre des tempêtes','嵐を呼ぶ怪獣','1976-05-30',NULL,NULL),
                                                                                                                          (48,36,35,'Le monstre des brumes','霧の怪獣現わる!','1976-06-06',NULL,NULL),
                                                                                                                          (49,37,36,'Le monstre des ruines','古代怪獣の復活','1976-06-13',NULL,NULL),
                                                                                                                          (50,38,37,'Le monstre des épaves','悪魔の円盤の恐怖','1976-06-20',NULL,NULL),
                                                                                                                          (51,39,38,'Le monstre des sources','熱泉怪獣を倒せ!','1976-06-27',NULL,NULL),
                                                                                                                          (52,40,39,'Le monstre des aurores boréales','オーロラ怪獣の恐怖','1976-07-04',NULL,NULL),
                                                                                                                          (53,41,40,'Le monstre des comètes','大彗星怪獣を倒せ!','1976-07-11',NULL,NULL),
                                                                                                                          (54,42,41,'Le monstre des cyclones','大竜巻怪獣の恐怖','1976-07-18',NULL,NULL),
                                                                                                                          (55,43,42,'Le monstre des éclipses','魔の円盤獣の恐怖','1976-07-25',NULL,NULL),
                                                                                                                          (56,44,43,'Le monstre des météorites','隕石怪獣を倒せ!','1976-08-01',NULL,NULL),
                                                                                                                          (57,45,44,'Le monstre des glaciers','大氷山怪獣の恐怖','1976-08-08',NULL,NULL),
                                                                                                                          (58,46,45,'Le monstre des éruptions','火山怪獣大暴れ','1976-08-15',NULL,NULL),
                                                                                                                          (59,47,46,'Le monstre des nuages','暗黒大円盤の恐怖','1976-08-22',NULL,NULL),
                                                                                                                          (60,48,47,'Le monstre des vagues','大津波怪獣を倒せ!','1976-08-29',NULL,NULL),
                                                                                                                          (61,49,48,'Le monstre des profondeurs','地底大怪獣の挑戦','1976-09-05',NULL,NULL),
                                                                                                                          (62,50,49,'Le monstre des tempêtes de sable','砂嵐怪獣の恐怖','1976-09-12',NULL,NULL),
                                                                                                                          (63,51,50,'Le monstre des aurores boréales','オーロラ怪獣を倒せ!','1976-09-19',NULL,NULL),
                                                                                                                          (64,52,51,'Le monstre des comètes','大彗星怪獣の最期','1976-09-26',NULL,NULL),
                                                                                                                          (65,53,52,'Le monstre des éclairs','放電怪獣大暴れ','1976-10-03',NULL,NULL),
                                                                                                                          (66,54,53,'Le monstre des neiges éternelles','大雪山の決闘','1976-10-10',NULL,NULL),
                                                                                                                          (67,55,54,'Le monstre des brumes mortelles','毒ガス怪獣を倒せ!','1976-10-17',NULL,NULL),
                                                                                                                          (68,56,55,'Le monstre des laves','溶岩怪獣の恐怖','1976-10-24',NULL,NULL),
                                                                                                                          (69,57,56,'Le monstre des tourbillons','大渦巻怪獣現わる!','1976-10-31',NULL,NULL),
                                                                                                                          (70,58,57,'Le monstre des glaces flottantes','流水怪獣を倒せ!','1976-11-07',NULL,NULL),
                                                                                                                          (71,59,58,'Le monstre des échos','反響怪獣の恐怖','1976-11-14',NULL,NULL),
                                                                                                                          (72,60,59,'Le monstre des marées','大潮怪獣大暴れ','1976-11-21',NULL,NULL),
                                                                                                                          (73,61,60,'Le monstre des mirages','しばり怪獣を倒せ!','1976-11-28',NULL,NULL),
                                                                                                                          (74,62,61,'Le monstre des ténèbres','暗黒大怪獣の挑戦','1976-12-05',NULL,NULL),
                                                                                                                          (75,63,62,'Le monstre des éclipses totales','皆既日食怪獣の恐怖','1976-12-12',NULL,NULL),
                                                                                                                          (76,64,63,'Le monstre des aurores australes','南極光怪獣を倒せ!','1976-12-19',NULL,NULL),
                                                                                                                          (77,65,64,'Le monstre des météores','流星怪獣大暴れ','1976-12-26',NULL,NULL),
                                                                                                                          (78,66,65,'Le monstre des comètes','すい星怪獣の最期','1977-01-02',NULL,NULL),
                                                                                                                          (79,67,66,'Le monstre des éruptions solaires','太陽怪獣を倒せ!','1977-01-09',NULL,NULL),
                                                                                                                          (80,68,67,'Le monstre des galaxies','銀河怪獣の恐怖','1977-01-16',NULL,NULL),
                                                                                                                          (81,69,68,'Le monstre des quasars','宇宙怪獣大暴れ','1977-01-23',NULL,NULL),
                                                                                                                          (82,70,69,'Le monstre des pulsars','中性子怪獣を倒せ!','1977-01-30',NULL,NULL),
                                                                                                                          (83,71,70,'Le monstre des trous noirs','ブラックホール怪獣の恐怖','1977-02-06',NULL,NULL),
                                                                                                                          (84,72,71,'Le monstre des supernovas','超新星怪獣大暴れ','1977-02-13',NULL,NULL),
                                                                                                                          (85,73,NULL,'Épisode non doublé en France','よみがえる怪獣軍団','1977-02-20',NULL,NULL);

-- --------------------------------------------------------
-- Table `monstres`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `monstres`;
CREATE TABLE `monstres` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `nom_fr` varchar(100) NOT NULL,
                            `nom_jp` varchar(100) DEFAULT NULL,
                            `episode_id` int DEFAULT NULL,
                            `description` text,
                            `type_monstre` varchar(50) DEFAULT NULL,
                            `taille` decimal(5,2) DEFAULT NULL,
                            `puissance` varchar(50) DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            KEY `episode_id` (`episode_id`),
                            KEY `idx_monstres_nom` (`nom_fr`),
                            CONSTRAINT `monstres_ibfk_1` FOREIGN KEY (`episode_id`) REFERENCES `episodes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `monstres` (`id`, `nom_fr`, `nom_jp`, `episode_id`, `description`, `type_monstre`, `taille`, `puissance`) VALUES
                                                                                                                          (5,'Gomoras','ゴモラス (Gomorasu)',NULL,'Premier monstre mécanique envoyé sur Terre','Robot Géant',40.00,'Haute'),
                                                                                                                          (6,'Dragon No.1','ドラゴン１号 (Doragon Ichigō)',NULL,'Robot dragon apparaissant tôt dans la série','Robot Géant',35.00,'Moyenne'),
                                                                                                                          (7,'Gedon','ゲドン (Gedon)',NULL,'Robot massif particulièrement puissant','Monstre',50.00,'Très Haute'),
                                                                                                                          (8,'Gorba','ゴルバ (Goruba)',NULL,'Robot équipé de pinces destructrices','Monstre',45.00,'Haute'),
                                                                                                                          (9,'Gomora S','ゴモラS (Gomora S)',NULL,'Version spatiale du Gomoras (Robot de Véga)','Robot',40.00,'Moyenne'),
                                                                                                                          (10,'Garan','ガラン (Garan)',NULL,'Robot à l\'apparence d\'insecte géant (Robot de Véga)','Robot',36.00,'Moyenne'),
                                                                                                                          (11,'Bazela','バゼラ (Bazera)',NULL,'Robot équipé d\'une épée et d\'un bouclier (Robot de Véga)','Robot',48.00,'Haute'),
                                                                                                                          (12,'Gadora','ガドラ (Gadora)',NULL,'Robot à l\'apparence de chauve-souris géante (Robot de Véga)','Robot',38.00,'Moyenne'),
                                                                                                                          (13,'Guella','ゲラ (Gera)',NULL,'Robot amphibie spécialisé (Robot de Véga)','Robot',42.00,'Moyenne'),
                                                                                                                          (14,'King Gomora','キングゴモラ (Kingu Gomora)',NULL,'Version royale du Gomora (Robot de Véga)','Robot',40.00,'Ultime'),
                                                                                                                          (15,'King Gadora','キングガドラ (Kingu Gadora)',NULL,'Version royale du Gadora (Robot de Véga)','Robot',38.00,'Ultime'),
                                                                                                                          (16,'King Bazela','キングバゼラ (Kingu Bazera)',NULL,'Version royale du Bazela (Robot de Véga)','Robot',48.00,'Ultime'),
                                                                                                                          (17,'Gomora H','ゴモラH (Gomora H)',NULL,'Version personnelle d\'Hydargos du Gomora (Robot de Véga)','Robot',40.00,'Moyenne'),
                                                                                                                          (18,'Gadora H','ガドラH (Gadora H)',NULL,'Version personnelle d\'Hydargos du Gadora (Robot de Véga)','Robot',38.00,'Moyenne'),
                                                                                                                          (19,'Guella H','ゲラH (Gera H)',NULL,'Version personnelle d\'Hydargos du Guella (Robot de Véga)','Robot',42.00,'Moyenne'),
                                                                                                                          (20,'Gomora R','ゴモラR (Gomora R)',NULL,'Version personnelle de Rubina du Gomora (Robot de Véga)','Robot',40.00,'Moyenne'),
                                                                                                                          (21,'Gadora R','ガドラR (Gadora R)',NULL,'Version personnelle de Rubina du Gadora (Robot de Véga)','Robot',38.00,'Moyenne'),
                                                                                                                          (22,'Guella R','ゲラR (Gera R)',NULL,'Version personnelle de Rubina du Guella (Robot de Véga)','Robot',42.00,'Moyenne'),
                                                                                                                          (24,'Véga No.1','ベガ１号 (Vega Ichigō)',NULL,'Vaisseau-mère de Véga - Vaisseau principal du Grand Marshal/Roi Véga','Vaisseau',120.00,'Très Haute'),
                                                                                                                          (25,'Véga No.2','ベガ２号 (Vega Nigō)',NULL,'Vaisseau-mère de Véga - Vaisseau de commandement du Prince de Rigel','Vaisseau',120.00,'Très Haute'),
                                                                                                                          (26,'Véga No.3','ベガ３号 (Vega Sangō)',NULL,'Vaisseau-mère de Véga - Vaisseau de commandement d\'Hydargos','Vaisseau',120.00,'Très Haute'),
                                                                                                                          (27,'Véga No.4','ベガ４号 (Vega Yongō)',NULL,'Vaisseau-mère de Véga - Vaisseau de commandement de Rubina','Vaisseau',120.00,'Très Haute'),
                                                                                                                          (28,'Véga No.5','ベガ５号 (Vega Gogō)',NULL,'Croiseur de combat de Véga - Croiseur standard de l\'armée de Véga','Vaisseau',80.00,'Haute'),
                                                                                                                          (29,'Véga No.6','ベガ６号 (Vega Rokugō)',NULL,'Croiseur de combat de Véga - Croiseur standard de l\'armée de Véga','Vaisseau',80.00,'Haute'),
                                                                                                                          (30,'Véga No.7','ベガ７号 (Vega Nanagō)',NULL,'Croiseur de combat de Véga - Croiseur standard de l\'armée de Véga','Vaisseau',80.00,'Haute'),
                                                                                                                          (31,'Véga No.0','ベガ０号 (Vega Zerogō)',NULL,'Vaisseau expérimental de Véga - Vaisseau expérimental ultime de Véga','Vaisseau',150.00,'Ultime'),
                                                                                                                          (32,'Véga No.37','ベガ37号 (Vega Sanjūnana-gō)',NULL,'Vaisseau de reconnaissance de Véga - Vaisseau spécialisé dans la reconnaissance','Vaisseau',60.00,'Très Haute'),
                                                                                                                          (33,'Véga No.38','ベガ38号 (Vega Sanjūhachi-gō)',NULL,'Vaisseau de recherche de Véga - Vaisseau de recherche scientifique','Vaisseau',60.00,'Très Haute'),
                                                                                                                          (34,'Bamboula','バンブーラ (Banbūra)',NULL,'Singe géant cybernétique, extrêmement agile et fort','Créature Cybernétique',35.00,'Haute'),
                                                                                                                          (35,'Grozam','グロザム (Gurozamu)',NULL,'Monstre volant ressemblant à une raie manta, cracheur de feu','Monstre Volant',32.00,'Moyenne'),
                                                                                                                          (36,'Gromazan','グロマザン (Guromazan)',NULL,'Créature volante semblable à un ptérodactyle mécanique','Monstre Volant',30.00,'Moyenne'),
                                                                                                                          (37,'Zaramel','ザラメル (Zarameru)',NULL,'Monstre marin géant envoyé pour attaquer depuis les océans','Monstre Marin',50.00,'Très Haute'),
                                                                                                                          (38,'Draken','ドラケン (Doraken)',NULL,'Dragon mécanique très redoutable','Dragon Mécanique',45.00,'Haute'),
                                                                                                                          (39,'Bouboule','スフェロイド (Suferoido)',NULL,'Robot sphérique géant et roulant, extrêmement résistant','Machine de Siège',25.00,'Moyenne'),
                                                                                                                          (40,'Robot-Crabe','キングクラブ (Kingu Kurabu)',NULL,'Énorme machine de siège en forme de crabe','Machine de Siège',30.00,'Haute'),
                                                                                                                          (41,'Robot-Scorpion','スコーピオン (Sukōpion)',NULL,'Machine de siège avec un dard et une queue puissante','Machine de Siège',28.00,'Haute'),
                                                                                                                          (42,'Robot-Serpent','スネーク (Sunēku)',NULL,'Machine longue et segmentée comme un serpent','Machine de Siège',60.00,'Moyenne');

-- --------------------------------------------------------
-- Table `users` (structure uniquement, sans données)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `oauth_provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Provider OAuth (google, github)',
                         `oauth_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID unique du provider',
                         `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `display_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `avatar_url` text COLLATE utf8mb4_unicode_ci,
                         `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                         `last_login` timestamp NULL DEFAULT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `unique_oauth` (`oauth_provider`,`oauth_id`),
                         KEY `idx_email` (`email`),
                         KEY `idx_provider` (`oauth_provider`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table `episode_monstres` (relation, vide)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `episode_monstres`;
CREATE TABLE `episode_monstres` (
                                    `id` int NOT NULL AUTO_INCREMENT,
                                    `episode_id` int NOT NULL,
                                    `monstre_id` int NOT NULL,
                                    `role_dans_episode` varchar(100) DEFAULT NULL,
                                    PRIMARY KEY (`id`),
                                    KEY `episode_id` (`episode_id`),
                                    KEY `monstre_id` (`monstre_id`),
                                    CONSTRAINT `episode_monstres_ibfk_1` FOREIGN KEY (`episode_id`) REFERENCES `episodes` (`id`),
                                    CONSTRAINT `episode_monstres_ibfk_2` FOREIGN KEY (`monstre_id`) REFERENCES `monstres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE personnages ADD COLUMN planete_origine VARCHAR(100) DEFAULT NULL;
