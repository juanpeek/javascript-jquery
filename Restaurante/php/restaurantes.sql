

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

DROP SCHEMA IF EXISTS restaurantestrass ;

-- -----------------------------------------------------
-- 
-- -----------------------------------------------------
CREATE SCHEMA restaurantestrass DEFAULT CHARACTER SET utf8 ;
USE restaurantestrass ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `restaurantes`
--

CREATE TABLE IF NOT EXISTS `restaurantes` (
  `idrest` smallint(5) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `mesas` smallint(2) unsigned NOT NULL,

  
  PRIMARY KEY (`idRest`)
) ENGINE=InnoDB DEFAULT CHARACTER SET latin1 COLLATE latin1_spanish_ci;




-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

CREATE TABLE IF NOT EXISTS `empleados` (
  `idemp` smallint(5) unsigned NOT NULL,
  `nomape` varchar(50) NOT NULL,
  `idrest` smallint(5) unsigned NOT NULL,
 PRIMARY KEY (`idemp`)
) ENGINE=InnoDB DEFAULT CHARACTER SET latin1 COLLATE latin1_spanish_ci;



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--


CREATE TABLE IF NOT EXISTS `reservas` (
  `idreservas` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `idrest` smallint(1) unsigned NOT NULL,
  `idemp` smallint(5) unsigned NOT NULL,
  `fecha` DATE NOT NULL,
  `mesa` smallint(1)  NOT NULL,
  `nomapecli` varchar(50) NOT NULL,
  `comensales` smallint(2)  NOT NULL,

 
  PRIMARY KEY (`idreservas`)
  ) ENGINE=InnoDB DEFAULT CHARACTER SET latin1 COLLATE latin1_spanish_ci;




-- Volcado de datos para la tabla `restaurantes`
--

INSERT INTO `restaurantes` (`idrest`, `name`, `mesas`) VALUES
(1, 'Restaurante I',6),
(2, 'Restaurante II', 5),
(3, 'Restaurante III', 10),
(4, 'Restaurante IV', 7);

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados`(`idemp`, `nomape`, `idrest`) VALUES
(1, 'Manuel Cruz Perez', 1),
(2, 'Maria Duato Suarez',2),
(3, 'Esteban Cuadrado Perez',3),
(4,'Esther Ramirez Palau',4),
(5, 'Andres Romero Sanz',1),
(6, 'Paula Rivera Sanchez',3),
(7, 'Candido Cano Lopez',4),
(8, 'Belen Vazquez Rodriguez',2),
(9, 'Santiago Perea Contreras',1);



