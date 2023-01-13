import React, {createContext, useState, useEffect} from 'react';

export const ModulesContext = createContext({
  modules: {},
  setAvailableModules: (modules) => {},

  //Modules
  inventario: false,

  packing: false,

  pklist: false,
  pklist_pickings_asignados: false,
  pklist_asigna_pickeadores: false,
  pklist_pendientes: false,
  pklist_seguimiento_picklist: false,
  pklist_asigna_montacargas: false,
  pklist_montacargas_asignados: false,

  recepciones: false,
  recepciones_lotes_lote: false,
  recepciones_lotes_parcial: false,
  recepciones_lotes: false,
  recepciones_rma: false,
  recepciones_traspaso: false,
  recepciones_asn: false,
  recepciones_remision: false,
  recepciones_orden_de_compra: false,

  salidas: false,
  salidas_medios_internos: false,
  salidas_medios_externos: false,

  ubicaciones: false,
  ubicaciones_temporales: false,
  ubicaciones_traspasos_internos: false,
  ubicaciones_pendientes: false,
  ubicaciones_pendientes_documentos: false,
  ubicaciones_pendientes_tarimas: false,
  ubicaciones_pendientes_articulos: false,
  ubicaciones_existencia: false,
  // recepciones: false,
  // recepciones: false,
});

function ModulesContextProvider({children}) {
  const [userModules, setUserModules] = useState({});

  const [recepciones, setrecepciones] = useState(false);
  const [recepciones_lotes_lote, setRecepciones_lotes_lote] = useState(false);
  const [recepciones_lotes_parcial, setRecepciones_lotes_parcial] =
    useState(false);
  const [recepciones_lotes, setRecepciones_lotes] = useState(false);
  const [recepciones_rma, setRecepciones_rma] = useState(false);
  const [recepciones_traspaso, setRecepciones_traspaso] = useState(false);
  const [recepciones_asn, setRecepciones_asn] = useState(false);
  const [recepciones_remision, setRecepciones_remision] = useState(false);
  const [recepciones_orden_de_compra, setRecepciones_orden_de_compra] =
    useState(false);

  const [packing, setpacking] = useState(false);
  const [salidas, setsalidas] = useState(false);
  const [ubicaciones, setubicaciones] = useState(false);
  const [inventario, setinventario] = useState(false);

  const [pklist, setpklist] = useState(false);
  const [pklist_pickings_asignados, setpklist_pickings_asignados] =
    useState(false);
  const [pklist_asigna_pickeadores, setpklist_asigna_pickeadores] =
    useState(false);
  const [pklist_montacargas_asignados, setpklist_montacargas_asignados] =
    useState(false);
  const [pklist_asigna_montacargas, setpklist_asigna_montacargas] =
    useState(false);
  const [pklist_seguimiento_picklist, setpklist_seguimiento_picklist] =
    useState(false);
  const [pklist_pendientes, setpklist_pendientes] = useState(false);
  const [salidas_medios_internos, setsalidas_medios_internos] = useState(false);
  const [salidas_medios_externos, setsalidas_medios_externos] = useState(false);

  const [ubicaciones_temporales, setubicaciones_temporales] = useState(false);
  const [ubicaciones_traspasos_internos, setubicaciones_traspasos_internos] =
    useState(false);
  const [ubicaciones_pendientes, setubicaciones_pendientes] = useState(false);
  const [
    ubicaciones_pendientes_documentos,
    setubicaciones_pendientes_documentos,
  ] = useState(false);
  const [ubicaciones_pendientes_tarimas, setubicaciones_pendientes_tarimas] =
    useState(false);
  const [
    ubicaciones_pendientes_articulos,
    setubicaciones_pendientes_articulos,
  ] = useState(false);
  const [ubicaciones_existencia, setubicaciones_existencia] = useState(false);

  useEffect(() => {
    for (let i = 0; i < userModules.length; i++) {
      const access = userModules[i].acceso == 1 ? false : true;

      switch (userModules[i].modulo) {
        case 'ubicaciones':
          setubicaciones(access);
          break;
        case 'ubicaciones_temporales':
          setubicaciones_temporales(access);
          break;
        case 'ubicaciones_traspasos_internos':
          setubicaciones_traspasos_internos(access);
          break;
        case 'ubicaciones_pendientes':
          setubicaciones_pendientes(access);
          break;
        case 'ubicaciones_pendientes_documentos':
          setubicaciones_pendientes_documentos(access);
          break;
        case 'ubicaciones_pendientes_tarimas':
          setubicaciones_pendientes_tarimas(access);
          break;
        case 'ubicaciones_pendientes_articulos':
          setubicaciones_pendientes_articulos(access);
          break;
        case 'ubicaciones_existencia':
          setubicaciones_existencia(access);
          break;

        case 'salidas':
          setsalidas(access);
          break;
        case 'salidas_medios_internos':
          setsalidas_medios_internos(access);
          break;
        case 'salidas_medios_externos':
          setsalidas_medios_externos(access);
          break;

        case 'recepciones':
          setrecepciones(access);
          break;
        case 'recepciones_lotes':
          setRecepciones_lotes(access);
          break;
        case 'recepciones_lotes_lote':
          setRecepciones_lotes_lote(access);
          break;
        case 'recepciones_lotes_parcial':
          setRecepciones_lotes_parcial(access);
          break;
        case 'recepciones_rma':
          setRecepciones_rma(access);
          break;
        case 'recepciones_traspaso':
          setRecepciones_traspaso(access);
          break;
        case 'recepciones_asn':
          setRecepciones_asn(access);
          break;
        case 'recepciones_remision':
          setRecepciones_remision(access);
          break;
        case 'recepciones_orden_de_compra':
          setRecepciones_orden_de_compra(access);
          break;

        case 'packing':
          setpacking(access);
          break;

        case 'pklist':
          setpklist(access);
          break;
        case 'pklist_pickings_asignados':
          setpklist_pickings_asignados(access);
          break;
        case 'pklist_asigna_pickeadores':
          setpklist_asigna_pickeadores(access);
          break;
        case 'pklist_montacargas_asignados':
          setpklist_montacargas_asignados(access);
          break;
        case 'pklist_asigna_montacargas':
          setpklist_asigna_montacargas(access);
          break;
        case 'pklist_seguimiento_picklist':
          setpklist_seguimiento_picklist(access);
          break;
        case 'pklist_pendientes':
          setpklist_pendientes(access);
          break;

        case 'inventario':
          setinventario(access);
          break;

        default:
          break;
      }
    }
  }, [userModules]);

  function setAvailableModules(modules) {
    setUserModules(modules);
  }

  const value = {
    modules: userModules,
    setAvailableModules: setAvailableModules,
    //Modules
    ubicaciones: ubicaciones,
    ubicaciones_temporales: ubicaciones_temporales,
    ubicaciones_traspasos_internos: ubicaciones_traspasos_internos,
    ubicaciones_pendientes: ubicaciones_pendientes,
    ubicaciones_pendientes_documentos: ubicaciones_pendientes_documentos,
    ubicaciones_pendientes_tarimas: ubicaciones_pendientes_tarimas,
    ubicaciones_pendientes_articulos: ubicaciones_pendientes_articulos,
    ubicaciones_existencia: ubicaciones_existencia,

    inventario: inventario,
    packing: packing,
    pklist: pklist,
    pklist_pickings_asignados: pklist_pickings_asignados,
    pklist_asigna_pickeadores: pklist_asigna_pickeadores,
    pklist_pendientes: pklist_pendientes,
    pklist_seguimiento_picklist: pklist_seguimiento_picklist,
    pklist_asigna_montacargas: pklist_asigna_montacargas,
    pklist_montacargas_asignados: pklist_montacargas_asignados,
    recepciones: recepciones,
    recepciones_lotes_lote: recepciones_lotes_lote,
    recepciones_lotes_parcial: recepciones_lotes_parcial,
    recepciones_lotes: recepciones_lotes,
    recepciones_rma: recepciones_rma,
    recepciones_traspaso: recepciones_traspaso,
    recepciones_asn: recepciones_asn,
    recepciones_remision: recepciones_remision,
    recepciones_orden_de_compra: recepciones_orden_de_compra,
    salidas: salidas,
    salidas_medios_internos: salidas_medios_internos,
    salidas_medios_externos: salidas_medios_externos,
  };

  return (
    <ModulesContext.Provider value={value}>{children}</ModulesContext.Provider>
  );
}

export default ModulesContextProvider;
