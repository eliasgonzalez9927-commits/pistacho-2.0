/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  ShieldCheck, 
  Truck, 
  Droplets, 
  History, 
  ChevronRight, 
  Menu, 
  X,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Download,
  Leaf,
  Award,
  BarChart3,
  Package,
  MessageCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon issue
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Components ---

const Logo = ({ scrolled, light = false }: { scrolled?: boolean; light?: boolean }) => (
  <div className="flex flex-col items-center">
    <div className={`w-12 h-12 mb-1 opacity-80 ${scrolled || !light ? 'text-pistachio' : 'text-sand'}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" />
        <path d="M50 20C50 20 35 40 35 60C35 80 50 90 50 90C50 90 65 80 65 60C65 40 50 20 50 20Z" stroke="currentColor" strokeWidth="1" />
        <path d="M50 35C50 35 40 50 40 65C40 80 50 85 50 85C50 85 60 80 60 65C60 50 50 35 50 35Z" stroke="currentColor" strokeWidth="1" />
        <path d="M50 50C50 50 45 60 45 70C45 80 50 82 50 82C50 82 55 80 55 70C55 60 50 50 50 50Z" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
    <div className="flex items-baseline leading-none">
      <span className={`text-2xl font-sans font-bold tracking-tighter ${scrolled || !light ? 'text-pistachio' : 'text-sand'}`}>green</span>
      <span className={`text-2xl font-sans font-bold tracking-tighter ${scrolled || !light ? 'text-charcoal/20' : 'text-sand/40'}`}>lat</span>
    </div>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Nosotros', href: '#about' },
    { name: 'Producción', href: '#production' },
    { name: 'Exportación', href: '#export' },
    { name: 'Calidad', href: '#quality' },
    { name: 'Sustentabilidad', href: '#sustainability' },
    { name: 'Especificaciones', href: '#specs' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-sand/90 backdrop-blur-md py-2 border-b border-charcoal/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <Logo scrolled={scrolled} light={true} />
        </a>
        
        <div className={`hidden xl:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold ${scrolled ? 'text-charcoal' : 'text-sand'}`}>
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-pistachio transition-colors">{link.name}</a>
          ))}
          <a href="#contact" className="btn-primary !py-2 !px-6">Consulta B2B</a>
        </div>

        <button className={`xl:hidden ${scrolled ? 'text-charcoal' : 'text-sand'}`} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-sand border-b border-charcoal/10 overflow-hidden"
          >
            <div className="p-8 flex flex-col gap-6 text-xs uppercase tracking-widest font-bold">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setIsOpen(false)}>{link.name}</a>
              ))}
              <a href="#contact" className="text-pistachio" onClick={() => setIsOpen(false)}>Contacto Directo</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const GlobalMap = () => {
  const sanJuan: [number, number] = [-31.5375, -68.5364];
  const destinations: { name: string; coords: [number, number] }[] = [
    { name: 'Hamburgo, Alemania', coords: [53.5511, 9.9937] },
    { name: 'Rotterdam, Países Bajos', coords: [51.9225, 4.4792] },
    { name: 'Nueva York, EE. UU.', coords: [40.7128, -74.0060] },
    { name: 'Shanghái, China', coords: [31.2304, 121.4737] },
    { name: 'Dubái, EAU', coords: [25.2048, 55.2708] },
  ];

  const routes = destinations.map(dest => [sanJuan, dest.coords]);

  return (
    <div className="w-full h-[600px] relative z-0 border border-charcoal/5 grayscale hover:grayscale-0 transition-all duration-1000">
      <div className="absolute top-8 left-8 z-10 bg-white/90 p-8 backdrop-blur-md border border-charcoal/5 max-w-sm shadow-2xl">
        <h4 className="text-charcoal font-serif text-2xl mb-4">Alcance Global Estratégico</h4>
        <p className="text-charcoal/60 text-xs leading-relaxed mb-6">
          Desde el corazón de San Juan, Argentina, nuestros pistachos viajan por las principales rutas marítimas hacia los centros de consumo más exigentes de Europa, Asia y América.
        </p>
        <div className="flex items-center gap-3 text-pistachio text-[10px] uppercase tracking-widest font-bold">
          <div className="w-2 h-2 bg-pistachio rounded-full animate-pulse"></div>
          Puerto de Salida: Buenos Aires / Valparaíso
        </div>
      </div>
      
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={false} 
        className="h-full w-full"
        style={{ background: '#F5F2ED' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <Marker position={sanJuan}>
          <Popup>
            <div className="font-serif font-bold text-pistachio">Greenlat HQ</div>
            <div className="text-xs">San Juan, Argentina</div>
          </Popup>
        </Marker>

        {destinations.map((dest, idx) => (
          <Marker key={idx} position={dest.coords}>
            <Popup>
              <div className="font-bold">{dest.name}</div>
              <div className="text-xs">Mercado de Exportación</div>
            </Popup>
          </Marker>
        ))}

        {routes.map((route, idx) => (
          <Polyline 
            key={idx} 
            positions={route as [number, number][]} 
            pathOptions={{ 
              color: '#93A661', 
              weight: 1, 
              dashArray: '5, 10',
              opacity: 0.3
            }} 
          />
        ))}
      </MapContainer>
    </div>
  );
};

// --- Sections ---

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/aerial-pistachio-plantation-sanjuan/1920/1080" 
          alt="Vista aérea de plantación de pistachos Greenlat en San Juan" 
          className="w-full h-full object-cover brightness-[0.55]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/80"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl"
        >
          <span className="text-sand uppercase tracking-[0.5em] text-[10px] font-bold mb-6 block">San Juan, Argentina | Exportación Global</span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-sand leading-[0.85] mb-10">
            Excelencia <br />
            <span className="italic font-normal">Agroindustrial</span>
          </h1>
          <p className="text-sand/90 text-lg md:text-xl mb-12 font-light leading-relaxed max-w-xl">
            Líderes en la producción y exportación de pistachos premium. Trazabilidad total desde el suelo andino hasta los mercados más exigentes del mundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <a href="#contact" className="btn-primary flex items-center justify-center gap-3">
              Solicitar Cotización B2B
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#specs" className="btn-outline !border-sand !text-sand hover:!bg-sand hover:!text-charcoal">
              Fichas Técnicas
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-4 text-sand/40">
        <div className="text-[10px] uppercase tracking-[0.3em] rotate-90 origin-right translate-y-12">Scroll to explore</div>
        <div className="w-px h-24 bg-sand/20"></div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://picsum.photos/seed/greenlat-history/800/1000" 
                alt="Historia de Greenlat" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 bg-pistachio p-16 hidden xl:block shadow-2xl">
              <div className="text-7xl font-serif text-sand mb-2">25+</div>
              <div className="text-[10px] uppercase tracking-widest text-sand/80 font-bold leading-tight">Años de <br />Trayectoria <br />Exportadora</div>
            </div>
          </div>

          <div>
            <span className="text-pistachio uppercase tracking-widest text-xs font-bold mb-6 block">Sobre Nosotros</span>
            <h2 className="text-5xl md:text-6xl mb-10 leading-tight">Tradición que <br /><span className="italic">Escala</span></h2>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-12">
              Greenlat nace en el corazón de San Juan, Argentina, una región con condiciones climáticas excepcionales para el cultivo del pistacho. Nuestra filosofía combina el respeto por la tierra con una visión industrial de vanguardia.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-sand flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-pistachio" />
                </div>
                <h4 className="text-xl">Ubicación Estratégica</h4>
                <p className="text-sm text-charcoal/60 leading-relaxed">Fincas situadas a los pies de los Andes, aprovechando el agua de deshielo y la amplitud térmica ideal.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-sand flex items-center justify-center">
                  <History className="w-6 h-6 text-pistachio" />
                </div>
                <h4 className="text-xl">Legado Productivo</h4>
                <p className="text-sm text-charcoal/60 leading-relaxed">Cuatro generaciones dedicadas a la excelencia agrícola, ahora enfocadas en el mercado global.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Production = () => {
  const stats = [
    { label: 'Hectáreas Cultivadas', value: '1,200+' },
    { label: 'Capacidad Anual', value: '3,500 TN' },
    { label: 'Variedad Principal', value: 'Kerman' },
    { label: 'Mercados Activos', value: '18 Países' },
  ];

  return (
    <section id="production" className="section-padding bg-charcoal text-sand">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <span className="text-pistachio uppercase tracking-widest text-xs font-bold mb-6 block">Producción de Pistachos</span>
            <h2 className="text-5xl md:text-7xl leading-tight">Capacidad e <br /><span className="italic">Innovación</span></h2>
          </div>
          <div className="lg:w-1/3 text-sand/60 text-sm leading-relaxed">
            Nuestra planta de procesamiento cuenta con tecnología de última generación para el pelado, secado y clasificación electrónica, asegurando uniformidad y calidad en cada lote.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 mb-24">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-12 bg-charcoal group hover:bg-pistachio transition-all duration-500">
              <div className="text-4xl font-serif mb-4 group-hover:text-sand transition-colors">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8 p-12 border border-white/5 hover:border-pistachio/30 transition-colors">
            <BarChart3 className="w-10 h-10 text-pistachio" />
            <h4 className="text-2xl">Variedades</h4>
            <p className="text-sand/60 text-sm leading-relaxed">Especializados en Kerman y Sirora, seleccionadas por su calibre superior y perfil de sabor intenso, altamente demandadas en el mercado europeo y árabe.</p>
          </div>
          <div className="space-y-8 p-12 border border-white/5 hover:border-pistachio/30 transition-colors">
            <Leaf className="w-10 h-10 text-pistachio" />
            <h4 className="text-2xl">Cosecha</h4>
            <p className="text-sand/60 text-sm leading-relaxed">Temporada de cosecha entre Febrero y Marzo. Implementamos recolección mecánica vibratoria para minimizar el contacto y preservar la integridad del fruto.</p>
          </div>
          <div className="space-y-8 p-12 border border-white/5 hover:border-pistachio/30 transition-colors">
            <Package className="w-10 h-10 text-pistachio" />
            <h4 className="text-2xl">Procesamiento</h4>
            <p className="text-sand/60 text-sm leading-relaxed">Control de humedad riguroso y selección óptica por color y tamaño. Capacidad de respuesta inmediata para pedidos de gran volumen.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Export = () => {
  return (
    <section id="export" className="bg-white">
      <div className="max-w-7xl mx-auto section-padding !pb-0">
        <div className="flex flex-col lg:flex-row gap-20 items-center mb-20">
          <div className="lg:w-1/2">
            <span className="text-pistachio uppercase tracking-widest text-xs font-bold mb-6 block">Mercados Globales</span>
            <h2 className="text-5xl md:text-6xl mb-10 leading-tight">Logística <br /><span className="italic">Sin Fronteras</span></h2>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-12">
              Exportamos a los principales hubs comerciales del mundo. Nuestra experiencia en comercio exterior nos permite gestionar despachos eficientes vía puertos de Buenos Aires (Atlántico) y Valparaíso (Pacífico).
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <Truck className="w-6 h-6 text-pistachio shrink-0" />
                <div>
                  <h5 className="font-bold text-sm uppercase tracking-widest mb-2">Fletes Internacionales</h5>
                  <p className="text-sm text-charcoal/60">Contratos con las principales navieras para asegurar espacios y tarifas competitivas durante todo el año.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <Globe className="w-6 h-6 text-pistachio shrink-0" />
                <div>
                  <h5 className="font-bold text-sm uppercase tracking-widest mb-2">Presencia en Ferias</h5>
                  <p className="text-sm text-charcoal/60">Participantes activos en Gulfood (Dubái), Anuga (Alemania) y SIAL (París).</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="https://picsum.photos/seed/export-logistics/800/600" 
              alt="Logística de Exportación Greenlat" 
              className="w-full h-auto grayscale shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
      <GlobalMap />
    </section>
  );
};

const Quality = () => {
  const certs = [
    { name: 'GlobalG.A.P', desc: 'Buenas Prácticas Agrícolas a nivel mundial.' },
    { name: 'HACCP', desc: 'Análisis de Peligros y Puntos Críticos de Control.' },
    { name: 'BRCGS', desc: 'Estándar Global de Seguridad Alimentaria.' },
    { name: 'SENASA', desc: 'Certificación fitosanitaria de origen.' },
  ];

  return (
    <section id="quality" className="section-padding bg-sand">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-pistachio uppercase tracking-widest text-xs font-bold mb-6 block">Calidad y Certificaciones</span>
          <h2 className="text-5xl md:text-6xl mb-8">Estándares de <br /><span className="italic">Excelencia</span></h2>
          <p className="text-charcoal/60 leading-relaxed">
            La seguridad alimentaria es nuestra prioridad absoluta. Cumplimos con las normativas más estrictas de la Unión Europea y Estados Unidos para la importación de frutos secos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {certs.map((cert, idx) => (
            <div key={idx} className="bg-white p-12 border border-charcoal/5 text-center group hover:border-pistachio transition-all">
              <Award className="w-12 h-12 text-pistachio mx-auto mb-8 group-hover:scale-110 transition-transform" />
              <h4 className="text-2xl mb-4">{cert.name}</h4>
              <p className="text-xs text-charcoal/50 leading-relaxed">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Sustainability = () => {
  return (
    <section id="sustainability" className="section-padding bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-pistachio uppercase tracking-widest text-xs font-bold mb-6 block">Sostenibilidad y Trazabilidad</span>
            <h2 className="text-5xl md:text-6xl mb-10 leading-tight">Compromiso con <br /><span className="italic">el Futuro</span></h2>
            <p className="text-charcoal/70 text-lg leading-relaxed mb-12">
              Implementamos un sistema de trazabilidad digital que permite conocer el historial completo de cada lote, desde la parcela de cultivo hasta el contenedor de exportación.
            </p>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-sand flex items-center justify-center shrink-0">
                  <Droplets className="w-6 h-6 text-pistachio" />
                </div>
                <div>
                  <h4 className="text-xl mb-2">Riego de Precisión</h4>
                  <p className="text-sm text-charcoal/60 leading-relaxed">Uso eficiente del agua mediante sensores de humedad y riego por goteo automatizado, preservando los recursos hídricos de San Juan.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-sand flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-pistachio" />
                </div>
                <div>
                  <h4 className="text-xl mb-2">Manejo Integrado</h4>
                  <p className="text-sm text-charcoal/60 leading-relaxed">Reducción del uso de agroquímicos mediante control biológico y monitoreo constante de plagas.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <img 
              src="https://picsum.photos/seed/sustainability-pistachio/800/1000" 
              alt="Sustentabilidad Greenlat" 
              className="w-full h-auto grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-12 -left-12 bg-charcoal text-sand p-12 hidden xl:block">
              <div className="text-xs uppercase tracking-widest font-bold mb-4">Huella de Carbono</div>
              <div className="text-4xl font-serif text-pistachio">Neutral</div>
              <div className="text-[10px] opacity-40 mt-2">Certificación en proceso 2026</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Specs = () => {
  const products = [
    { name: 'Pistacho con Cáscara', formats: ['18/20', '21/25', '26/30'], img: 'shell' },
    { name: 'Pistacho Pelado (Kernel)', formats: ['Whole', 'Splits', 'Pieces'], img: 'kernel' },
    { name: 'Harina de Pistacho', formats: ['Fina', 'Extra Fina'], img: 'flour' },
  ];

  return (
    <section id="specs" className="section-padding bg-charcoal text-sand">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <span className="text-pistachio uppercase tracking-widest text-xs font-bold mb-6 block">Especificaciones de Producto</span>
            <h2 className="text-5xl md:text-7xl leading-tight">Formatos y <br /><span className="italic">Packaging</span></h2>
          </div>
          <button className="btn-primary flex items-center gap-3">
            <Download className="w-4 h-4" />
            Descargar Catálogo Técnico
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {products.map((product, idx) => (
            <div key={idx} className="bg-charcoal p-12 group hover:bg-white/5 transition-all">
              <div className="aspect-square bg-sand/5 mb-12 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/pistachio-${product.img}/600/600`} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-3xl mb-8">{product.name}</h4>
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Calibres / Formatos</div>
                <div className="flex flex-wrap gap-3">
                  {product.formats.map((f, i) => (
                    <span key={i} className="px-3 py-1 border border-white/20 text-[10px] uppercase tracking-widest">{f}</span>
                  ))}
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-4">Empaque Estándar</div>
                <p className="text-xs text-sand/60">Bolsas de polipropileno de 10kg, 25kg o Big Bags de 1000kg.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  const [formState, setFormState] = useState('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <section id="contact" className="section-padding bg-sand">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-24">
          <div className="lg:col-span-2">
            <span className="text-pistachio uppercase tracking-widest text-xs font-bold mb-6 block">Contacto para Compradores</span>
            <h2 className="text-5xl md:text-6xl mb-10 leading-tight">Inicie su <br /><span className="italic">Consulta B2B</span></h2>
            <p className="text-charcoal/60 text-lg leading-relaxed mb-12">
              Nuestro equipo de exportación está disponible para discutir volúmenes, términos de pago (L/C, T/T) y cronogramas de embarque.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-pistachio" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Teléfono / WhatsApp</div>
                  <div className="text-lg font-medium">+54 264 456 7890</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-pistachio" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Email Corporativo</div>
                  <div className="text-lg font-medium">export@greenlat.com.ar</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-pistachio" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">Oficina Comercial</div>
                  <div className="text-lg font-medium">San Juan, Argentina</div>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <a 
                href="https://wa.me/542644567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-pistachio font-bold uppercase tracking-widest text-xs hover:text-pistachio-dark transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chatear con un Asesor de Ventas
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-12 lg:p-20 shadow-2xl">
            {formState === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-pistachio/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-pistachio" />
                </div>
                <h3 className="text-3xl">Consulta Recibida</h3>
                <p className="text-charcoal/60">Gracias por su interés. Un gerente de cuentas internacionales se pondrá en contacto con usted en las próximas 24 horas hábiles.</p>
                <button onClick={() => setFormState('idle')} className="text-pistachio font-bold uppercase tracking-widest text-xs">Enviar otra consulta</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Nombre Completo</label>
                    <input required type="text" className="w-full bg-sand/30 border-b border-charcoal/10 py-4 focus:border-pistachio outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Empresa / Organización</label>
                    <input required type="text" className="w-full bg-sand/30 border-b border-charcoal/10 py-4 focus:border-pistachio outline-none transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Email Corporativo</label>
                    <input required type="email" className="w-full bg-sand/30 border-b border-charcoal/10 py-4 focus:border-pistachio outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">País de Destino</label>
                    <input required type="text" className="w-full bg-sand/30 border-b border-charcoal/10 py-4 focus:border-pistachio outline-none transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Volumen Estimado (TN)</label>
                  <select className="w-full bg-sand/30 border-b border-charcoal/10 py-4 focus:border-pistachio outline-none transition-colors">
                    <option>Menos de 5 TN</option>
                    <option>5 - 20 TN</option>
                    <option>20 - 100 TN</option>
                    <option>Más de 100 TN</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Mensaje / Requerimientos Especiales</label>
                  <textarea rows={4} className="w-full bg-sand/30 border-b border-charcoal/10 py-4 focus:border-pistachio outline-none transition-colors resize-none"></textarea>
                </div>
                <button 
                  disabled={formState === 'submitting'}
                  className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {formState === 'submitting' ? 'Enviando...' : 'Enviar Solicitud de Información'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-charcoal text-sand py-20 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-2">
          <Logo light={false} />
        </div>
        
        <div className="flex gap-12 text-[10px] uppercase tracking-widest font-bold opacity-40">
          <a href="#" className="hover:text-pistachio transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-pistachio transition-colors">Instagram</a>
          <a href="#" className="hover:text-pistachio transition-colors">YouTube</a>
        </div>

        <div className="text-[10px] uppercase tracking-widest font-bold opacity-40">
          © 2026 Greenlat Pistachios. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Production />
        <Export />
        <Quality />
        <Sustainability />
        <Specs />
        <Contact />
      </main>
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/542644567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-pistachio rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform group"
      >
        <MessageCircle className="w-8 h-8 text-sand" />
        <span className="absolute right-20 bg-charcoal text-sand text-[10px] uppercase tracking-widest font-bold py-2 px-4 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Contactar Ventas
        </span>
      </a>
    </div>
  );
}
