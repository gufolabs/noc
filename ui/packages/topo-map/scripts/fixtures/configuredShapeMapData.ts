import { MapConverterInput } from "../../src";

export const glyphSegmentMapData: MapConverterInput = {
  id: '694f2320f73e86f3d01e51c2',
  type: 'segment',
  max_links: 1000,
  grid_size: 25,
  normalize_position: true,
  object_status_refresh_interval: 60,
  background_image: null,
  background_opacity: null,
  name: 'ALL',
  width: 156.25,
  height: 123.75,
  caps: [],
  nodes: [
    {
      role: 'segment',
      address: '1.1.1.1',
      type: 'managedobject',
      id: '1',
      x: 56.25,
      y: 23.75,
      node_id: 1,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'SAE lllllllll xxx',
      glyph: 61996,
      cls: 'gf-1x',
      shape_overlay: [
        {
          code: 58024,
          position: 'E',
          form: 's'
        }
      ],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '192.168.133.13',
      type: 'managedobject',
      id: '2',
      x: 156.25,
      y: 123.75,
      node_id: 2,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'chr-1',
      glyph: 61996,
      cls: 'gf-1x',
      shape_overlay: [],
      ports: [
        {
          id: 1,
          ports: ['ether1']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '192.168.133.14',
      type: 'managedobject',
      id: '3',
      x: 156.25,
      y: 23.75,
      node_id: 3,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'chr-2',
      glyph: 61996,
      cls: 'gf-1x',
      shape_overlay: [
        {
          code: 0xE30B,
          position: 'NE',
          form: 'c'
        }
      ],
      ports: [
        {
          id: 0,
          ports: ['ether2']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    }
  ],
  links: [
    {
      connector: 'normal',
      id: '69676d2cfa1bc463f16465e2',
      type: 'link',
      method: 'lldp',
      ports: [0, 1],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000
    }
  ]
};

export const configuredShapeMapData: MapConverterInput = {
  id: '6972456b3819bc893f2ab6c5',
  type: 'configured',
  max_links: 1000,
  grid_size: 25,
  normalize_position: false,
  object_status_refresh_interval: 60,
  background_image: '/bg/demo.png',
  background_opacity: 30,
  name: 'configured',
  width: 3200,
  height: 1800,
  caps: [],
  nodes: [
    {
      type: 'objectgroup',
      id: '6973ffeb8ce3e3bca2229017',
      x: 1300,
      y: 100,
      node_id: '6973ffeb8ce3e3bca2229017',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Атмосфера+ZIAX',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '6973ffeb8ce3e3bca2229017'
      }
    },
    {
      type: 'objectgroup',
      id: '69723f3e3819bc893f2ab6ab',
      x: 1600,
      y: 1025,
      node_id: '69723f3e3819bc893f2ab6ab',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Видеоаналитика',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '69723f3e3819bc893f2ab6ab'
      }
    },
    {
      type: 'objectgroup',
      id: '69723f163819bc893f2ab6a1',
      x: 1050,
      y: 100,
      node_id: '69723f163819bc893f2ab6a1',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Корпоративная связь',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '69723f163819bc893f2ab6a1'
      }
    },
    {
      type: 'objectgroup',
      id: '6973fff38ce3e3bca222901a',
      x: 1525,
      y: 100,
      node_id: '6973fff38ce3e3bca222901a',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'СИЗАР-База знаний',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '6973fff38ce3e3bca222901a'
      }
    },
    {
      type: 'objectgroup',
      id: '69723f5c3819bc893f2ab6b4',
      x: 1000,
      y: 1025,
      node_id: '69723f5c3819bc893f2ab6b4',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Свободно-конфигурируемая зона',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '69723f5c3819bc893f2ab6b4'
      }
    },
    {
      type: 'objectgroup',
      id: '69723f483819bc893f2ab6ae',
      x: 2150,
      y: 1025,
      node_id: '69723f483819bc893f2ab6ae',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Сети передачи данных и мониторинг',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '69723f483819bc893f2ab6ae'
      }
    },
    {
      type: 'objectgroup',
      id: '69723f363819bc893f2ab6a8',
      x: 2900,
      y: 75,
      node_id: '69723f363819bc893f2ab6a8',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Ситуационный центр',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '69723f363819bc893f2ab6a8'
      }
    },
    {
      type: 'objectgroup',
      id: '69723f2d3819bc893f2ab6a5',
      x: 1950,
      y: 100,
      node_id: '69723f2d3819bc893f2ab6a5',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Технологическая связь',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '69723f2d3819bc893f2ab6a5'
      }
    },
    {
      type: 'objectgroup',
      id: '69723f523819bc893f2ab6b1',
      x: 2500,
      y: 1025,
      node_id: '69723f523819bc893f2ab6b1',
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Энербас+Ревизор',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: {
        resource_group: '69723f523819bc893f2ab6b1'
      }
    },
    {
      role: 'segment',
      address: '10.100.16.162',
      type: 'managedobject',
      id: '31',
      x: 2025,
      y: 900,
      node_id: 31,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'СОВА Моноблок',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 59,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.19',
      type: 'managedobject',
      id: '25',
      x: 2700,
      y: 200,
      node_id: 25,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-16@10018',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 51,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.3',
      type: 'managedobject',
      id: '5',
      x: 950,
      y: 350,
      node_id: 5,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-25@10002',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 7,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: null,
      type: 'managedobject',
      id: '17',
      x: 2555.9749979999997,
      y: 275.5,
      node_id: 17,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Рупор громкоговорителя настенный',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.105',
      type: 'managedobject',
      id: '16',
      x: 2325,
      y: 25,
      node_id: 16,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'УПГ-78#3',
      shape: 'Cisco/phone',
      shape_width: 40,
      shape_height: 30,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.17',
      type: 'managedobject',
      id: '13',
      x: 1650,
      y: 400,
      node_id: 13,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'РТУ Дилинговый пульт@10016',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 19,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.102',
      type: 'managedobject',
      id: '14',
      x: 2050,
      y: 250,
      node_id: 14,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'УПГ-78#1',
      shape: 'Cisco/phone',
      shape_width: 40,
      shape_height: 30,
      shape_overlay: [],
      ports: [
        {
          id: 21,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.220',
      type: 'managedobject',
      id: '39',
      x: 1800,
      y: 800,
      node_id: 39,
      metrics_label: '',
      metrics_template: '',
      level: 100,
      name: 'СОВА IDS3730-48P-6X',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        { id: 0, ports: ['gigabitethernet0/33'] },
        { id: 2, ports: ['gigabitethernet0/19'] },
        { id: 4, ports: ['gigabitethernet0/23'] },
        { id: 6, ports: ['gigabitethernet0/27'] },
        { id: 10, ports: ['gigabitethernet0/21'] },
        { id: 12, ports: ['gigabitethernet0/13'] },
        { id: 16, ports: ['gigabitethernet0/31'] },
        { id: 18, ports: ['gigabitethernet0/22'] },
        { id: 20, ports: ['gigabitethernet0/20'] },
        { id: 23, ports: ['gigabitethernet0/30'] },
        { id: 39, ports: ['gigabitethernet0/8'] },
        { id: 46, ports: ['gigabitethernet0/28'] },
        { id: 48, ports: ['gigabitethernet0/4'] },
        { id: 50, ports: ['gigabitethernet0/10'] },
        { id: 61, ports: ['gigabitethernet0/45'] },
        { id: 64, ports: ['gigabitethernet0/35'] },
        { id: 66, ports: ['gigabitethernet0/29'] },
        { id: 68, ports: ['gigabitethernet0/11'] },
        { id: 70, ports: ['gigabitethernet0/26'] },
        { id: 72, ports: ['gigabitethernet0/12'] }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.8',
      type: 'managedobject',
      id: '35',
      x: 875,
      y: 325,
      node_id: 35,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-13@10007',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 65,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: null,
      type: 'managedobject',
      id: '38',
      x: 1800,
      y: 950,
      node_id: 38,
      metrics_label: '',
      metrics_template: '',
      level: 100,
      name: 'СОВА NSS4330-32TXP-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.226',
      type: 'managedobject',
      id: '27',
      x: 1400,
      y: 875,
      node_id: 27,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Vizorlabs Ноутбук',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 55,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.5',
      type: 'managedobject',
      id: '7',
      x: 900,
      y: 100,
      node_id: 7,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-13@10004',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.11',
      type: 'managedobject',
      id: '3',
      x: 1025,
      y: 225,
      node_id: 3,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-25@10010',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 3,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.100',
      type: 'managedobject',
      id: '48',
      x: 1775,
      y: 225,
      node_id: 48,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'LCE',
      shape: 'Flaticon/hub',
      shape_width: 32,
      shape_height: 32,
      shape_overlay: [],
      ports: [
        {
          id: 35,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.12',
      type: 'managedobject',
      id: '6',
      x: 1225,
      y: 225,
      node_id: 6,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-16@10011',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 9,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.103',
      type: 'managedobject',
      id: '18',
      x: 2150,
      y: 250,
      node_id: 18,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'УПГ-07',
      shape: 'Cisco/phone',
      shape_width: 40,
      shape_height: 30,
      shape_overlay: [],
      ports: [
        {
          id: 29,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.225',
      type: 'managedobject',
      id: '26',
      x: 1525,
      y: 900,
      node_id: 26,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Vizorlabs Моноблок',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 53,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.221',
      type: 'managedobject',
      id: '32',
      x: 1800,
      y: 875,
      node_id: 32,
      metrics_label: '',
      metrics_template: '',
      level: 100,
      name: 'СОВА NSS4330-32TXP-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        { id: 8, ports: ['gigabitethernet0/4'] },
        { id: 14, ports: ['gigabitethernet0/6'] },
        { id: 36, ports: ['gigabitethernet0/14'] },
        { id: 52, ports: ['gigabitethernet0/23'] },
        { id: 54, ports: ['gigabitethernet0/13'] },
        { id: 56, ports: ['gigabitethernet0/9'] },
        { id: 58, ports: ['gigabitethernet0/7'] },
        { id: 60, ports: ['gigabitethernet0/24'] },
        { id: 62, ports: ['gigabitethernet0/3'] }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.4',
      type: 'managedobject',
      id: '8',
      x: 950,
      y: 200,
      node_id: 8,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-22@10003',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 11,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.10',
      type: 'managedobject',
      id: '42',
      x: 1650,
      y: 250,
      node_id: 42,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-25@10009',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 69,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.14',
      type: 'managedobject',
      id: '43',
      x: 900,
      y: 50,
      node_id: 43,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-13@10013',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.9',
      type: 'managedobject',
      id: '36',
      x: 875,
      y: 175,
      node_id: 36,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-13@10008',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 67,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.115',
      type: 'managedobject',
      id: '19',
      x: 2275,
      y: 250,
      node_id: 19,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Техносвязь Пульт СОДС@10021',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 37,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.104',
      type: 'managedobject',
      id: '15',
      x: 2325,
      y: 75,
      node_id: 15,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'УПГ-78#2',
      shape: 'Cisco/phone',
      shape_width: 40,
      shape_height: 30,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.16',
      type: 'managedobject',
      id: '12',
      x: 900,
      y: 425,
      node_id: 12,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'РТУ Пульт СОДС@10015',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 17,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.13',
      type: 'managedobject',
      id: '4',
      x: 950,
      y: 300,
      node_id: 4,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-27@10012',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 5,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.15',
      type: 'managedobject',
      id: '41',
      x: 1650,
      y: 300,
      node_id: 41,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-27@10014',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 71,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.130',
      type: 'managedobject',
      id: '21',
      x: 2900,
      y: 250,
      node_id: 21,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'САЦ Моноблок 2',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 47,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.99',
      type: 'managedobject',
      id: '47',
      x: 1775,
      y: 325,
      node_id: 47,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'LDE 2',
      shape: 'Flaticon/hub',
      shape_width: 32,
      shape_height: 32,
      shape_overlay: [],
      ports: [
        {
          id: 25,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.131',
      type: 'managedobject',
      id: '22',
      x: 2900,
      y: 325,
      node_id: 22,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'САЦ Моноблок 3',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 43,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.132',
      type: 'managedobject',
      id: '23',
      x: 2900,
      y: 400,
      node_id: 23,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'САЦ Моноблок 4',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 45,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.227',
      type: 'managedobject',
      id: '28',
      x: 1475,
      y: 950,
      node_id: 28,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Vizorlabs Камера Dahua',
      shape: 'Flaticon/web-camera',
      shape_width: 32,
      shape_height: 32,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.21',
      type: 'managedobject',
      id: '10',
      x: 1300,
      y: 225,
      node_id: 10,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Атмосфера Моноблок',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 15,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.2',
      type: 'managedobject',
      id: '2',
      x: 875,
      y: 250,
      node_id: 2,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-27@10001',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 1,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.161',
      type: 'managedobject',
      id: '33',
      x: 2375,
      y: 900,
      node_id: 33,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Энербас Моноблок 1',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 63,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.101',
      type: 'managedobject',
      id: '44',
      x: 1975,
      y: 250,
      node_id: 44,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'УПГ-12E-BM',
      shape: 'Cisco/phone',
      shape_width: 40,
      shape_height: 30,
      shape_overlay: [],
      ports: [
        {
          id: 31,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.20',
      type: 'managedobject',
      id: '9',
      x: 1100,
      y: 225,
      node_id: 9,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'РТУ моноблок 1',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 13,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.18',
      type: 'managedobject',
      id: '24',
      x: 2625,
      y: 200,
      node_id: 24,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-25@10017',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 49,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.98',
      type: 'managedobject',
      id: '46',
      x: 1775,
      y: 375,
      node_id: 46,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'LDE 1',
      shape: 'Flaticon/hub',
      shape_width: 32,
      shape_height: 32,
      shape_overlay: [],
      ports: [
        {
          id: 27,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.228',
      type: 'managedobject',
      id: '29',
      x: 1675,
      y: 925,
      node_id: 29,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Vizorlabs гобопроектор',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.6',
      type: 'managedobject',
      id: '40',
      x: 1650,
      y: 350,
      node_id: 40,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-27@10005',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 73,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.7',
      type: 'managedobject',
      id: '37',
      x: 900,
      y: 0,
      node_id: 37,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Т-25@10006',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.229',
      type: 'managedobject',
      id: '30',
      x: 1325,
      y: 900,
      node_id: 30,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Vizorlabs громкоговоритель',
      shape: 'Cisco/ip_phone',
      shape_width: 54.025002,
      shape_height: 29.5,
      shape_overlay: [],
      ports: [
        {
          id: 57,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.22',
      type: 'managedobject',
      id: '11',
      x: 1525,
      y: 225,
      node_id: 11,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'СИЗАР Моноблок',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.110',
      type: 'managedobject',
      id: '45',
      x: 1775,
      y: 275,
      node_id: 45,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'LBC-8',
      shape: 'Flaticon/hub',
      shape_width: 32,
      shape_height: 32,
      shape_overlay: [],
      ports: [
        {
          id: 33,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '10.100.16.129',
      type: 'managedobject',
      id: '20',
      x: 2900,
      y: 175,
      node_id: 20,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'САЦ Моноблок 1',
      shape: 'Cisco/workstation',
      shape_width: 46.25,
      shape_height: 37.5,
      shape_overlay: [],
      ports: [
        {
          id: 41,
          ports: ['port0']
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      type: 'cloud',
      id: '697ba229d58805e96c998be6',
      x: 1850,
      y: 375,
      node_id: null,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name:
        '(СОВА IDS3730-48P-6X: gigabitethernet0/30, LDE 2: port0, LDE 1: port0, УПГ-07: port0, УПГ-12E-BM: port0, LBC-8: port0, LCE: port0)',
      shape: 'Cisco/cloud',
      shape_width: 102.74,
      shape_height: 59.05,
      shape_overlay: [],
      ports: [
        { id: 22, ports: ['cloud'] },
        { id: 24, ports: ['cloud'] },
        { id: 26, ports: ['cloud'] },
        { id: 28, ports: ['cloud'] },
        { id: 30, ports: ['cloud'] },
        { id: 32, ports: ['cloud'] },
        { id: 34, ports: ['cloud'] }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      type: 'cloud',
      id: '697bae5bd58805e96c998c0b',
      x: 2500,
      y: 550,
      node_id: null,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name:
        '(СОВА IDS3730-48P-6X: gigabitethernet0/8, САЦ Моноблок 1: port0, САЦ Моноблок 3: port0, САЦ Моноблок 4: port0)',
      shape: 'Cisco/cloud',
      shape_width: 102.74,
      shape_height: 59.05,
      shape_overlay: [],
      ports: [
        { id: 38, ports: ['cloud'] },
        { id: 40, ports: ['cloud'] },
        { id: 42, ports: ['cloud'] },
        { id: 44, ports: ['cloud'] }
      ],
      caps: [],
      object_filter: null,
      external: false
    }
  ],
  links: [
    { connector: 'normal', id: '697baec7d58805e96c998c11', type: 'link', method: 'xmac', ports: [58, 59], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979f8fdf2119e8e0900a61d', type: 'link', method: 'xmac', ports: [50, 51], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979da8586f4fce918901796', type: 'link', method: 'xmac', ports: [6, 7], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979ffd9d58805e96c998849', type: 'link', method: 'xmac', ports: [18, 19], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '69793cfc8bd5ac6651e251c5', type: 'link', method: 'xmac', ports: [20, 21], in_bw: 100000000, out_bw: 100000000, bw: 100000000 },
    { connector: 'normal', id: '69791a5545b9868b4f2a9550', type: 'link', method: 'xmac', ports: [0, 1], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '69791a5545b9868b4f2a9551', type: 'link', method: 'xmac', ports: [2, 3], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697918e345b9868b4f2a94f2', type: 'link', method: 'xmac', ports: [4, 5], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697918e345b9868b4f2a94ef', type: 'link', method: 'xmac', ports: [10, 11], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979eaedf2119e8e0900a5f5', type: 'link', method: 'xmac', ports: [12, 13], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979ffd9d58805e96c99884a', type: 'link', method: 'xmac', ports: [16, 17], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697ba229d58805e96c998be6-22-23', type: 'link', method: 'xmac', ports: [22, 23], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697bae5bd58805e96c998c0b-38-39', type: 'link', method: 'xmac', ports: [38, 39], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697bae5bd58805e96c998c0c', type: 'link', method: 'xmac', ports: [46, 47], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979ca3986f4fce918901755', type: 'link', method: 'xmac', ports: [48, 49], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '69791d2d3e491851cf4d9569', type: 'link', method: 'lldp', ports: [60, 61], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979da8586f4fce918901794', type: 'link', method: 'xmac', ports: [64, 65], in_bw: 100000000, out_bw: 100000000, bw: 100000000 },
    { connector: 'normal', id: '69791a5545b9868b4f2a954e', type: 'link', method: 'xmac', ports: [66, 67], in_bw: 100000000, out_bw: 100000000, bw: 100000000 },
    { connector: 'normal', id: '697918e345b9868b4f2a94f1', type: 'link', method: 'xmac', ports: [68, 69], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697918e345b9868b4f2a94f3', type: 'link', method: 'xmac', ports: [70, 71], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979da8586f4fce918901795', type: 'link', method: 'xmac', ports: [72, 73], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697baec7d58805e96c998c10', type: 'link', method: 'xmac', ports: [54, 55], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697ba229d58805e96c998be6-34-35', type: 'link', method: 'xmac', ports: [34, 35], in_bw: 0, out_bw: 0, bw: 0 },
    { connector: 'normal', id: '6979dae986f4fce918901799', type: 'link', method: 'xmac', ports: [8, 9], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697ba229d58805e96c998be6-28-29', type: 'link', method: 'xmac', ports: [28, 29], in_bw: 0, out_bw: 0, bw: 0 },
    { connector: 'normal', id: '697c76e1d58805e96c998df2', type: 'link', method: 'xmac', ports: [52, 53], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '6979eb51f2119e8e0900a5f8', type: 'link', method: 'xmac', ports: [14, 15], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697baf24d58805e96c998c14', type: 'link', method: 'xmac', ports: [36, 37], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697c9cf8d58805e96c998e53', type: 'link', method: 'xmac', ports: [56, 57], in_bw: 100000000, out_bw: 100000000, bw: 100000000 },
    { connector: 'normal', id: '6979eb51f2119e8e0900a5f9', type: 'link', method: 'xmac', ports: [62, 63], in_bw: 1000000000, out_bw: 1000000000, bw: 1000000000 },
    { connector: 'normal', id: '697ba229d58805e96c998be6-24-25', type: 'link', method: 'xmac', ports: [24, 25], in_bw: 0, out_bw: 0, bw: 0 },
    { connector: 'normal', id: '697bae5bd58805e96c998c0b-42-43', type: 'link', method: 'xmac', ports: [42, 43], in_bw: 0, out_bw: 0, bw: 0 },
    { connector: 'normal', id: '697bae5bd58805e96c998c0b-44-45', type: 'link', method: 'xmac', ports: [44, 45], in_bw: 0, out_bw: 0, bw: 0 },
    { connector: 'normal', id: '697ba229d58805e96c998be6-30-31', type: 'link', method: 'xmac', ports: [30, 31], in_bw: 0, out_bw: 0, bw: 0 },
    { connector: 'normal', id: '697ba229d58805e96c998be6-26-27', type: 'link', method: 'xmac', ports: [26, 27], in_bw: 0, out_bw: 0, bw: 0 },
    { connector: 'normal', id: '697ba229d58805e96c998be6-32-33', type: 'link', method: 'xmac', ports: [32, 33], in_bw: 0, out_bw: 0, bw: 0 },
    { connector: 'normal', id: '697bae5bd58805e96c998c0b-40-41', type: 'link', method: 'xmac', ports: [40, 41], in_bw: 0, out_bw: 0, bw: 0 }
  ]
};

export const demoData = {
  id: '65c11747023ff5aea0ff8eb0',
  type: 'segment',
  max_links: 1000,
  grid_size: 25,
  normalize_position: true,
  object_status_refresh_interval: 60,
  background_image: null,
  background_opacity: null,
  name: 'Макеевка',
  width: 250.23240219154445,
  height: 3559.9343176001444,
  caps: [],
  nodes: [
    {
      role: 'segment',
      address: '172.25.3.57',
      type: 'managedobject',
      id: '151',
      x: 348.75,
      y: 3533.6843176001444,
      node_id: 151,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-27-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.74',
      type: 'managedobject',
      id: '103',
      x: 819.9315570076143,
      y: 1282.9283576119321,
      node_id: 103,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkkerch9a-0-0cd8-fd1208sr1',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 133,
          ports: [
            'ge0/0/4'
          ]
        },
        {
          id: 262,
          ports: [
            'xge0/0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.0.2',
      portal: {
        generator: 'segment',
        id: '6871775a92311a10af76e568',
        settings: null
      },
      type: 'managedobject',
      id: '32',
      x: 2301.272278259431,
      y: 2161.51374795781,
      node_id: 32,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkost1-0-10d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 39,
          ports: [
            '1:10'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.82',
      type: 'managedobject',
      id: '170',
      x: 1148.75,
      y: 3383.6843176001444,
      node_id: 170,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-10-дом--подъезд-5',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.5',
      type: 'managedobject',
      id: '192',
      x: 1335.1350804016913,
      y: 3247.634317600144,
      node_id: 192,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkosen13-0-01bd4-bdp3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 80,
          ports: [
            'GigaEthernet0/3'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.23',
      type: 'managedobject',
      id: '27',
      x: 978.8523262781865,
      y: 2240.2287089845627,
      node_id: 27,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mktango-0-0bd4-bdp3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 34,
          ports: [
            'GigaEthernet0/4'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.0.250',
      type: 'managedobject',
      id: '92',
      x: 548.75,
      y: 3333.6843176001444,
      node_id: 92,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkhim6-0-1z28-zxr105928FI',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.8',
      type: 'managedobject',
      id: '96',
      x: 1492.0626009678742,
      y: 516.2165781428655,
      node_id: 96,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkmak63-0-0bd8-bdp3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 64,
          ports: [
            'GigaEthernet0/8'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.122',
      type: 'managedobject',
      id: '178',
      x: 2348.75,
      y: 3533.6843176001444,
      node_id: 178,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'ул.Островского-10-башня',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.7.34',
      portal: {
        generator: 'segment',
        id: '6871775a92311a10af76e568',
        settings: null
      },
      type: 'managedobject',
      id: '36',
      x: 1355.7535518579582,
      y: 1649.2057030795104,
      node_id: 36,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkost1-0-30cd16-fd1216s',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 256,
          ports: [
            'xge0/0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.33',
      type: 'managedobject',
      id: '141',
      x: 2248.75,
      y: 3433.6843176001444,
      node_id: 141,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-20-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.64',
      type: 'managedobject',
      id: '160',
      x: 1148.75,
      y: 3533.6843176001444,
      node_id: 160,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-31-Дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.75',
      type: 'managedobject',
      id: '184',
      x: 659.99375,
      y: 3278.7843176001443,
      node_id: 184,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkhjtols6-0-1bd4-bdp3310b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.66',
      type: 'managedobject',
      id: '158',
      x: 1648.75,
      y: 3483.6843176001444,
      node_id: 158,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-33-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.25',
      type: 'managedobject',
      id: '132',
      x: 1648.75,
      y: 3433.6843176001444,
      node_id: 132,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-18-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.2',
      type: 'managedobject',
      id: '191',
      x: 1166.886555037964,
      y: 3144.4451305597786,
      node_id: 191,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkmon3b-0-1bd16-bdgp360016b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 81,
          ports: [
            'ge0/0/4'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.7.14',
      portal: {
        generator: 'segment',
        id: '687170154d04abddc979821c',
        settings: null
      },
      type: 'managedobject',
      id: '186',
      x: 1514.6038760740744,
      y: 1895.46790301123,
      node_id: 186,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkzap2-0-0bd8-p3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 79,
          ports: [
            'TGigaEthernet0/2'
          ]
        },
        {
          id: 304,
          ports: [
            'GigaEthernet0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.7.4',
      type: 'managedobject',
      id: '97',
      x: 1588.656608392909,
      y: 691.8835575681353,
      node_id: 97,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkmon3b-0-1bd16-bdp360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 65,
          ports: [
            'GigaEthernet0/3'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.31.1',
      type: 'managedobject',
      id: '89',
      x: 2210.0783623022035,
      y: 2677.4416177564517,
      node_id: 89,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkmos-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 44,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.39',
      type: 'managedobject',
      id: '248',
      node_id: 248,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkk74-0-0cd8-fd1208s',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 282,
          ports: [
            'xge0/0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      x: 118.27748996522999,
      y: 18.850000000000023,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.11',
      type: 'managedobject',
      id: '128',
      x: 548.75,
      y: 3383.6843176001444,
      node_id: 128,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--9-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.7.106',
      portal: {
        generator: 'segment',
        id: '687177524d04abddc979823c',
        settings: null
      },
      type: 'managedobject',
      id: '38',
      x: 1249.999219250629,
      y: 1653.2862950318963,
      node_id: 38,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mklen117-0-81bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 63,
          ports: [
            'TGigaEthernet0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.98',
      type: 'managedobject',
      id: '172',
      x: 1348.75,
      y: 3383.6843176001444,
      node_id: 172,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-11-дом--подъезд-4',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.201',
      type: 'managedobject',
      id: '235',
      x: 1656.25,
      y: 3283.6843176001444,
      node_id: 235,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve01',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.210',
      type: 'managedobject',
      id: '232',
      x: 2356.25,
      y: 3333.6843176001444,
      node_id: 232,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve10',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.60',
      type: 'managedobject',
      id: '154',
      x: 748.75,
      y: 3533.6843176001444,
      node_id: 154,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-28-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.12',
      type: 'managedobject',
      id: '196',
      x: 1280.819865186251,
      y: 1898.0386183006067,
      node_id: 196,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mknikit125-0-01bd4-bdp3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 206,
          ports: [
            'GigaEthernet0/3'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.70',
      type: 'managedobject',
      id: '161',
      x: 1248.75,
      y: 3483.6843176001444,
      node_id: 161,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-31-Дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.0.57',
      type: 'managedobject',
      id: '69',
      x: 448.75,
      y: 3283.6843176001444,
      node_id: 69,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkgorb-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.101',
      type: 'managedobject',
      id: '167',
      x: 48.75,
      y: 3433.6843176001444,
      node_id: 167,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--7-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.202',
      type: 'managedobject',
      id: '236',
      x: 1756.25,
      y: 3333.6843176001444,
      node_id: 236,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve02',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.55',
      type: 'managedobject',
      id: '212',
      x: 1317.2204950881994,
      y: 1440.9233311334697,
      node_id: 212,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkgrib4-0-0cd8-fd1208sr1',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 238,
          ports: [
            'ge0/0/4'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.41',
      type: 'managedobject',
      id: '203',
      x: 1059.99375,
      y: 3278.7843176001443,
      node_id: 203,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mklih60-0-01bd4-bdp3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.46',
      type: 'managedobject',
      id: '215',
      x: 1259.99375,
      y: 3278.7843176001443,
      node_id: 215,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkpigrz12-1bd8-p3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 299,
          ports: [
            'TGigaEthernet0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.6',
      type: 'managedobject',
      id: '202',
      x: 845.3427602182074,
      y: 1453.9164506149725,
      node_id: 202,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkcherb1-0-01cd8-fd1208s',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 139,
          ports: [
            'ge0/0/4'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.207',
      type: 'managedobject',
      id: '250',
      node_id: 250,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve07',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      x: 0,
      y: 3559.9343176001444,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.203',
      type: 'managedobject',
      id: '237',
      x: 1856.25,
      y: 3283.6843176001444,
      node_id: 237,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve03',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.36.104',
      type: 'managedobject',
      id: '21',
      x: 1780.5105360835164,
      y: 1465.4268453276852,
      node_id: 21,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkgrib35-0-0e28-mes2124f',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 31,
          ports: [
            'Gi 1/0/28'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.47',
      type: 'managedobject',
      id: '251',
      node_id: 251,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkavt1-0-01cd8-fd1208s ',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 305,
          ports: [
            'ge0/0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      x: 250.23240219154445,
      y: 1032.4270770354303,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.26',
      type: 'managedobject',
      id: '99',
      x: 1616.7182117849159,
      y: 2274.5520422434797,
      node_id: 99,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkrud9b-3-1cd8-fd1208sr1',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 60,
          ports: [
            'xge0/0/4'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.31.52',
      type: 'managedobject',
      id: '243',
      x: 2448.75,
      y: 3283.6843176001444,
      node_id: 243,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'test',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.204',
      type: 'managedobject',
      id: '238',
      x: 1956.25,
      y: 3333.6843176001444,
      node_id: 238,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve04',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '151.0.1.66',
      type: 'managedobject',
      id: '233',
      x: 356.25,
      y: 3333.6843176001444,
      node_id: 233,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkgav1-0-0m11-rb2011',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.205',
      type: 'managedobject',
      id: '239',
      x: 2056.25,
      y: 3283.6843176001444,
      node_id: 239,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve05',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.28.100.16',
      portal: {
        generator: 'segment',
        id: '5eaf1ca4802a86311a8657c5',
        settings: null
      },
      type: 'managedobject',
      id: '14',
      x: 1803.558259005334,
      y: 1621.832705567877,
      node_id: 14,
      metrics_label: '',
      metrics_template: '',
      level: 200,
      name: 'rocco.n.htel.cc',
      shape: 'Juniper/l2_l3_switch',
      shape_width: 42.0765,
      shape_height: 42.0757,
      shape_overlay: [],
      ports: [
        {
          id: 1,
          ports: [
            'xe-0/0/40'
          ]
        },
        {
          id: 5,
          ports: [
            'xe-0/0/41'
          ]
        },
        {
          id: 7,
          ports: [
            'et-0/0/49'
          ]
        },
        {
          id: 9,
          ports: [
            'xe-0/0/42'
          ]
        },
        {
          id: 11,
          ports: [
            'xe-0/0/44'
          ]
        },
        {
          id: 13,
          ports: [
            'xe-0/0/46'
          ]
        },
        {
          id: 15,
          ports: [
            'xe-0/0/43'
          ]
        },
        {
          id: 17,
          ports: [
            'xe-0/0/45'
          ]
        },
        {
          id: 19,
          ports: [
            'xe-0/0/47'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'downlink',
      address: '172.28.100.9',
      portal: {
        generator: 'segment',
        id: '5eaf1ca4802a86311a8657c5',
        settings: null
      },
      type: 'managedobject',
      id: '11',
      x: 997.6226561504968,
      y: 2098.5837800019876,
      node_id: 11,
      metrics_label: '',
      metrics_template: '',
      level: 200,
      name: 'al.n.htel.cc',
      shape: 'Juniper/generic_router',
      shape_width: 36.5438,
      shape_height: 36.546,
      shape_overlay: [],
      ports: [
        {
          id: 24,
          ports: [
            'xe-0/0/21'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.7.48',
      type: 'managedobject',
      id: '111',
      x: 1084.1739131181575,
      y: 1364.6720074318903,
      node_id: 111,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mknp-0-3cd8-fd1208s',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 180,
          ports: [
            'xge0/0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.206',
      type: 'managedobject',
      id: '240',
      x: 2156.25,
      y: 3333.6843176001444,
      node_id: 240,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve06',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.51',
      type: 'managedobject',
      id: '146',
      x: 2048.75,
      y: 3483.6843176001444,
      node_id: 146,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-34-дом--подъезд-6',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.208',
      type: 'managedobject',
      id: '241',
      x: 2256.25,
      y: 3283.6843176001444,
      node_id: 241,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pve08',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.2',
      type: 'managedobject',
      id: '177',
      x: 2448.75,
      y: 3483.6843176001444,
      node_id: 177,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'ул.Островского-10-подъезд',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.77',
      type: 'managedobject',
      id: '106',
      x: 1385.440206486934,
      y: 1859.3767326633754,
      node_id: 106,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkusp36-0-0bd4-bdp3310b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 248,
          ports: [
            'GigaEthernet0/4'
          ]
        },
        {
          id: 250,
          ports: [
            'GigaEthernet0/3'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.28.100.34',
      portal: {
        generator: 'segment',
        id: '687177524d04abddc979823c',
        settings: null
      },
      type: 'managedobject',
      id: '208',
      x: 1448.3099702547834,
      y: 1962.8459349963575,
      node_id: 208,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'mklen117-0-41jmx240-bras04-connie',
      shape: 'Cisco/broadband_router_d',
      shape_width: 47.5,
      shape_height: 47.5,
      shape_overlay: [],
      ports: [
        {
          id: 86,
          ports: [
            'xe-2/0/0'
          ]
        },
        {
          id: 88,
          ports: [
            'xe-2/1/0'
          ]
        },
        {
          id: 90,
          ports: [
            'xe-2/3/0'
          ]
        },
        {
          id: 92,
          ports: [
            'xe-2/0/2'
          ]
        },
        {
          id: 94,
          ports: [
            'xe-2/1/2'
          ]
        },
        {
          id: 96,
          ports: [
            'xe-2/2/0'
          ]
        },
        {
          id: 98,
          ports: [
            'xe-2/2/1'
          ]
        },
        {
          id: 100,
          ports: [
            'xe-2/0/1'
          ]
        },
        {
          id: 102,
          ports: [
            'xe-2/3/3'
          ]
        },
        {
          id: 104,
          ports: [
            'xe-2/0/3'
          ]
        },
        {
          id: 106,
          ports: [
            'xe-2/3/1'
          ]
        },
        {
          id: 108,
          ports: [
            'xe-2/1/1'
          ]
        },
        {
          id: 110,
          ports: [
            'xe-2/1/3'
          ]
        },
        {
          id: 112,
          ports: [
            'xe-2/3/2'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.7.32',
      type: 'managedobject',
      id: '206',
      x: 1662.8482144019445,
      y: 2497.3558334038275,
      node_id: 206,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkkir14a-0-02cd8-fd1208s',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 265,
          ports: [
            'ge0/0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.27',
      type: 'managedobject',
      id: '37',
      x: 1003.5497403487317,
      y: 1627.6233913249891,
      node_id: 37,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mknp-0-1bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 68,
          ports: [
            'TGigaEthernet0/6'
          ]
        },
        {
          id: 181,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.205',
      type: 'managedobject',
      id: '214',
      x: 1059.561553279295,
      y: 3228.9252747797636,
      node_id: 214,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkdep167-0-12bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 208,
          ports: [
            'GigaEthernet0/8'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.7.101',
      portal: {
        generator: 'segment',
        id: '6871775a92311a10af76e568',
        settings: null
      },
      type: 'managedobject',
      id: '24',
      x: 1135.1783890310762,
      y: 2192.9730555679853,
      node_id: 24,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkost1-0-81bd16-p36162te',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 246,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.12',
      type: 'managedobject',
      id: '122',
      x: 1448.75,
      y: 3433.6843176001444,
      node_id: 122,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-11-дом--подъезд-6',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 285,
          ports: [
            '25'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.37',
      type: 'managedobject',
      id: '26',
      x: 1055.5786606625643,
      y: 1900.6841726119483,
      node_id: 26,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mktango-0-0bd8-p3600',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 32,
          ports: [
            'TGigaEthernet0/2'
          ]
        },
        {
          id: 35,
          ports: [
            'GigaEthernet0/6'
          ]
        },
        {
          id: 224,
          ports: [
            'TGigaEthernet0/1'
          ]
        },
        {
          id: 226,
          ports: [
            'TGigaEthernet0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.1',
      type: 'managedobject',
      id: '59',
      x: 1559.3702471988188,
      y: 2044.2788301581354,
      node_id: 59,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mksun22-0-3d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 232,
          ports: [
            '1:24'
          ]
        },
        {
          id: 292,
          ports: [
            '1:1'
          ]
        },
        {
          id: 302,
          ports: [
            '1:8'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.7.107',
      portal: {
        generator: 'segment',
        id: '687177524d04abddc979823c',
        settings: null
      },
      type: 'managedobject',
      id: '40',
      x: 1406.440158890869,
      y: 1340.6872454401955,
      node_id: 40,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mklen117-0-83bd16-p36162te',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 187,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.40',
      type: 'managedobject',
      id: '134',
      x: 1470.9566544263314,
      y: 1050.8307171217887,
      node_id: 134,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-19-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 273,
          ports: [
            '25'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.111',
      type: 'managedobject',
      id: '80',
      x: 1056.4554326146604,
      y: 1988.499779631327,
      node_id: 80,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mksun22-0-2d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 231,
          ports: [
            '1:17'
          ]
        },
        {
          id: 234,
          ports: [
            '1:1'
          ]
        },
        {
          id: 288,
          ports: [
            '1:12'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.34.212',
      type: 'managedobject',
      id: '70',
      x: 1173.737878984813,
      y: 1947.8808054878912,
      node_id: 70,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkrud9-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 55,
          ports: [
            '1:19'
          ]
        },
        {
          id: 75,
          ports: [
            '1:20'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.17',
      type: 'managedobject',
      id: '190',
      x: 144.5745169074411,
      y: 2358.952113579623,
      node_id: 190,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mktor48-0-01cd8-fd1208s',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 202,
          ports: [
            'ge0/0/2'
          ]
        },
        {
          id: 294,
          ports: [
            'xge0/0/1'
          ]
        },
        {
          id: 307,
          ports: [
            'xge0/0/4'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.33.160',
      type: 'managedobject',
      id: '22',
      x: 1305.268616609684,
      y: 1010.6231396744342,
      node_id: 22,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkvyaz8-0-1d10-dgs110010me',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 27,
          ports: [
            '10'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.3',
      type: 'managedobject',
      id: '194',
      x: 821.3414334944198,
      y: 2091.00945759329,
      node_id: 194,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mklip4-0-01bd8-p3600',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 82,
          ports: [
            'GigaEthernet0/1'
          ]
        },
        {
          id: 172,
          ports: [
            'TGigaEthernet0/6'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.32',
      type: 'managedobject',
      id: '119',
      x: 1189.309605134073,
      y: 2278.0989141950695,
      node_id: 119,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-34-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 230,
          ports: [
            '26'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.25',
      type: 'managedobject',
      id: '180',
      x: 1049.2273974693014,
      y: 2902.5579920720884,
      node_id: 180,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: ' mkzor-0-2bd4-bdp3310c  ',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.5',
      type: 'managedobject',
      id: '139',
      x: 948.75,
      y: 3383.6843176001444,
      node_id: 139,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-10-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.42',
      type: 'managedobject',
      id: '245',
      x: 959.99375,
      y: 3328.7843176001443,
      node_id: 245,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkklsvo7-0-0bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.10',
      type: 'managedobject',
      id: '130',
      x: 748.75,
      y: 3383.6843176001444,
      node_id: 130,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--9-дом--подъезд-5',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.7.82',
      portal: {
        generator: 'segment',
        id: '687170154d04abddc979821c',
        settings: null
      },
      type: 'managedobject',
      id: '227',
      x: 917.8697504332218,
      y: 1615.1958073595292,
      node_id: 227,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkzapsto-0bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 188,
          ports: [
            'TGigaEthernet0/5'
          ]
        },
        {
          id: 196,
          ports: [
            'TGigaEthernet0/6'
          ]
        },
        {
          id: 298,
          ports: [
            'TGigaEthernet0/3'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.27',
      type: 'managedobject',
      id: '142',
      x: 2348.75,
      y: 3383.6843176001444,
      node_id: 142,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-22-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.53',
      type: 'managedobject',
      id: '204',
      x: 1402.96484582118,
      y: 2280.779432842594,
      node_id: 204,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkkir14a-0-0bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 264,
          ports: [
            'GigaEthernet0/7'
          ]
        },
        {
          id: 266,
          ports: [
            'TGigaEthernet0/1'
          ]
        },
        {
          id: 268,
          ports: [
            'TGigaEthernet0/6'
          ]
        },
        {
          id: 270,
          ports: [
            'TGigaEthernet0/2'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.255.11',
      portal: {
        generator: 'segment',
        id: '6871775a92311a10af76e568',
        settings: null
      },
      type: 'managedobject',
      id: '31',
      x: 1430.813132375359,
      y: 1777.365997963761,
      node_id: 31,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkost1-0-15al26-os6850',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 36,
          ports: [
            '1/25'
          ]
        },
        {
          id: 43,
          ports: [
            '1/15'
          ]
        },
        {
          id: 233,
          ports: [
            '1/19'
          ]
        },
        {
          id: 235,
          ports: [
            '1/20'
          ]
        },
        {
          id: 237,
          ports: [
            '1/22'
          ]
        },
        {
          id: 239,
          ports: [
            '1/23'
          ]
        },
        {
          id: 255,
          ports: [
            '1/21'
          ]
        },
        {
          id: 301,
          ports: [
            '1/11'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.7.89',
      type: 'managedobject',
      id: '219',
      x: 1166.5267916040495,
      y: 1539.8260213988804,
      node_id: 219,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkcgost25-0-0cd8-fd1208sb0',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 258,
          ports: [
            'xge0/0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.255.3',
      type: 'managedobject',
      id: '242',
      x: 1556.25,
      y: 3333.6843176001444,
      node_id: 242,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'pbs',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.51',
      type: 'managedobject',
      id: '188',
      x: 159.99375,
      y: 3328.7843176001443,
      node_id: 188,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkavt1-0-01cd8-fd1208s',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.92',
      type: 'managedobject',
      id: '144',
      x: 248.75,
      y: 3433.6843176001444,
      node_id: 144,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--8-дом--подъезд-4',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.150',
      type: 'managedobject',
      id: '189',
      x: 1684.7520457977853,
      y: 1948.7156956720994,
      node_id: 189,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkusp35-0-0cd8-fd1208s',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 300,
          ports: [
            'ge0/0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.0.250',
      type: 'managedobject',
      id: '224',
      x: 1381.287810528049,
      y: 2761.6034556225054,
      node_id: 224,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkhim6-0-1d30-dsg313030s',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 179,
          ports: [
            'Eth1/0/12'
          ]
        },
        {
          id: 183,
          ports: [
            'Eth1/0/10'
          ]
        },
        {
          id: 185,
          ports: [
            'Eth1/0/27'
          ]
        },
        {
          id: 199,
          ports: [
            'Eth1/0/3'
          ]
        },
        {
          id: 201,
          ports: [
            'Eth1/0/2'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.85',
      type: 'managedobject',
      id: '127',
      x: 2089.0901218811946,
      y: 1979.3769330054677,
      node_id: 127,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-10-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 308,
          ports: [
            '25'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.62',
      type: 'managedobject',
      id: '156',
      x: 1748.75,
      y: 3533.6843176001444,
      node_id: 156,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-34-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.89',
      type: 'managedobject',
      id: '137',
      x: 348.75,
      y: 3383.6843176001444,
      node_id: 137,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--9-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.56',
      type: 'managedobject',
      id: '218',
      x: 1048.5828321452402,
      y: 1505.0434205472088,
      node_id: 218,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkniz2-0-00bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 130,
          ports: [
            'TGigaEthernet0/2'
          ]
        },
        {
          id: 132,
          ports: [
            'GigaEthernet0/5'
          ]
        },
        {
          id: 253,
          ports: [
            'TGigaEthernet0/1'
          ]
        },
        {
          id: 263,
          ports: [
            'TGigaEthernet0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.88',
      type: 'managedobject',
      id: '220',
      x: 899.7242586784938,
      y: 1969.3001922431295,
      node_id: 220,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkhim6-0-0cd8-fd1208sr1',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 260,
          ports: [
            'xge0/0/4'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.9',
      type: 'managedobject',
      id: '244',
      x: 1448.75,
      y: 3283.6843176001444,
      node_id: 244,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mksev11-5-0cs26-c950',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.34.227',
      type: 'managedobject',
      id: '73',
      x: 248.75,
      y: 3283.6843176001444,
      node_id: 73,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkdep167-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.20',
      type: 'managedobject',
      id: '197',
      x: 727.9386802890284,
      y: 1625.4255918347071,
      node_id: 197,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mknikit125-0-02bd8-p3608',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 221,
          ports: [
            'GigaEthernet0/2'
          ]
        },
        {
          id: 222,
          ports: [
            'GigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.59',
      type: 'managedobject',
      id: '153',
      x: 548.75,
      y: 3533.6843176001444,
      node_id: 153,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-28-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.28.100.33',
      portal: {
        generator: 'segment',
        id: '687177524d04abddc979823c',
        settings: null
      },
      type: 'managedobject',
      id: '211',
      x: 1643.5228213969722,
      y: 1392.6885028852673,
      node_id: 211,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'mklen117-0-51jmx80-bras03-fredo',
      shape: 'Cisco/broadband_router_d',
      shape_width: 47.5,
      shape_height: 47.5,
      shape_overlay: [],
      ports: [
        {
          id: 116,
          ports: [
            'xe-0/0/2'
          ]
        },
        {
          id: 118,
          ports: [
            'xe-0/0/1'
          ]
        },
        {
          id: 120,
          ports: [
            'xe-0/0/3'
          ]
        },
        {
          id: 122,
          ports: [
            'xe-0/0/0'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.41',
      type: 'managedobject',
      id: '123',
      x: 48.75,
      y: 3483.6843176001444,
      node_id: 123,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-22-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.255.10',
      type: 'managedobject',
      id: '16',
      x: 1199.8956960988357,
      y: 1831.0786085969357,
      node_id: 16,
      metrics_label: '',
      metrics_template: '',
      level: 150,
      name: 'nick.n.htel.cc',
      shape: 'Juniper/l2_l3_switch',
      shape_width: 42.0765,
      shape_height: 42.0757,
      shape_overlay: [],
      ports: [
        {
          id: 3,
          ports: [
            'xe-0/0/19'
          ]
        },
        {
          id: 20,
          ports: [
            'et-0/0/52'
          ]
        },
        {
          id: 22,
          ports: [
            'et-0/0/53'
          ]
        },
        {
          id: 25,
          ports: [
            'xe-0/0/29'
          ]
        },
        {
          id: 28,
          ports: [
            'xe-0/0/31'
          ]
        },
        {
          id: 33,
          ports: [
            'xe-0/0/27'
          ]
        },
        {
          id: 37,
          ports: [
            'xe-0/0/20'
          ]
        },
        {
          id: 59,
          ports: [
            'xe-0/0/13'
          ]
        },
        {
          id: 69,
          ports: [
            'xe-0/0/39'
          ]
        },
        {
          id: 78,
          ports: [
            'xe-0/0/32'
          ]
        },
        {
          id: 125,
          ports: [
            'xe-0/0/25'
          ]
        },
        {
          id: 141,
          ports: [
            'xe-0/0/14'
          ]
        },
        {
          id: 189,
          ports: [
            'xe-0/0/41'
          ]
        },
        {
          id: 197,
          ports: [
            'xe-0/0/42'
          ]
        },
        {
          id: 205,
          ports: [
            'ge-0/0/3'
          ]
        },
        {
          id: 213,
          ports: [
            'xe-0/0/15'
          ]
        },
        {
          id: 215,
          ports: [
            'xe-0/0/8'
          ]
        },
        {
          id: 241,
          ports: [
            'xe-0/0/0'
          ]
        },
        {
          id: 242,
          ports: [
            'xe-0/0/24'
          ]
        },
        {
          id: 247,
          ports: [
            'xe-0/0/16'
          ]
        },
        {
          id: 252,
          ports: [
            'xe-0/0/17'
          ]
        },
        {
          id: 257,
          ports: [
            'xe-0/0/12'
          ]
        },
        {
          id: 259,
          ports: [
            'xe-0/0/36'
          ]
        },
        {
          id: 261,
          ports: [
            'xe-0/0/9'
          ]
        },
        {
          id: 269,
          ports: [
            'xe-0/0/40'
          ]
        },
        {
          id: 283,
          ports: [
            'xe-0/0/6'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.29',
      type: 'managedobject',
      id: '136',
      x: 1548.75,
      y: 3533.6843176001444,
      node_id: 136,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-33-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.34.228',
      type: 'managedobject',
      id: '74',
      x: 893.237800385092,
      y: 3061.4281193256884,
      node_id: 74,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkdep167-0-2d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 167,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.75',
      type: 'managedobject',
      id: '165',
      x: 948.75,
      y: 3533.6843176001444,
      node_id: 165,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-30-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.11.10',
      type: 'managedobject',
      id: '104',
      x: 759.99375,
      y: 3328.7843176001443,
      node_id: 104,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkhngav1-0-0bd4-bdcom3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.31.145',
      type: 'managedobject',
      id: '84',
      x: 599.1856478241954,
      y: 1969.8071089898392,
      node_id: 84,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkkrzv-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 83,
          ports: [
            '1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.15',
      type: 'managedobject',
      id: '173',
      x: 2448.75,
      y: 3433.6843176001444,
      node_id: 173,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-22-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.63',
      type: 'managedobject',
      id: '157',
      x: 711.5051445610328,
      y: 2085.5711722540027,
      node_id: 157,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-32-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 289,
          ports: [
            '17'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.37',
      type: 'managedobject',
      id: '129',
      x: 1748.75,
      y: 3383.6843176001444,
      node_id: 129,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-18-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.28.100.18',
      type: 'managedobject',
      id: '15',
      x: 1501.6566916744566,
      y: 1661.162966766875,
      node_id: 15,
      metrics_label: '',
      metrics_template: '',
      level: 150,
      name: 'joey.n.htel.cc',
      shape: 'Juniper/l2_l3_switch',
      shape_width: 42.0765,
      shape_height: 42.0757,
      shape_overlay: [],
      ports: [
        {
          id: 0,
          ports: [
            'xe-0/0/40'
          ]
        },
        {
          id: 2,
          ports: [
            'xe-0/0/0'
          ]
        },
        {
          id: 4,
          ports: [
            'xe-0/0/41'
          ]
        },
        {
          id: 6,
          ports: [
            'et-0/0/53'
          ]
        },
        {
          id: 8,
          ports: [
            'xe-0/0/42'
          ]
        },
        {
          id: 10,
          ports: [
            'xe-0/0/44'
          ]
        },
        {
          id: 12,
          ports: [
            'xe-0/0/46'
          ]
        },
        {
          id: 14,
          ports: [
            'xe-0/0/43'
          ]
        },
        {
          id: 16,
          ports: [
            'xe-0/0/45'
          ]
        },
        {
          id: 18,
          ports: [
            'xe-0/0/47'
          ]
        },
        {
          id: 21,
          ports: [
            'et-0/0/48'
          ]
        },
        {
          id: 23,
          ports: [
            'et-0/0/49'
          ]
        },
        {
          id: 62,
          ports: [
            'xe-0/0/6'
          ]
        },
        {
          id: 87,
          ports: [
            'xe-0/0/8'
          ]
        },
        {
          id: 89,
          ports: [
            'xe-0/0/51:0'
          ]
        },
        {
          id: 91,
          ports: [
            'xe-0/0/20'
          ]
        },
        {
          id: 93,
          ports: [
            'xe-0/0/10'
          ]
        },
        {
          id: 95,
          ports: [
            'xe-0/0/51:2'
          ]
        },
        {
          id: 97,
          ports: [
            'xe-0/0/16'
          ]
        },
        {
          id: 99,
          ports: [
            'xe-0/0/17'
          ]
        },
        {
          id: 101,
          ports: [
            'xe-0/0/9'
          ]
        },
        {
          id: 103,
          ports: [
            'xe-0/0/23'
          ]
        },
        {
          id: 105,
          ports: [
            'xe-0/0/11'
          ]
        },
        {
          id: 107,
          ports: [
            'xe-0/0/22'
          ]
        },
        {
          id: 109,
          ports: [
            'xe-0/0/51:1'
          ]
        },
        {
          id: 111,
          ports: [
            'xe-0/0/51:3'
          ]
        },
        {
          id: 113,
          ports: [
            'xe-0/0/21'
          ]
        },
        {
          id: 117,
          ports: [
            'xe-0/0/27'
          ]
        },
        {
          id: 119,
          ports: [
            'xe-0/0/25'
          ]
        },
        {
          id: 121,
          ports: [
            'xe-0/0/26'
          ]
        },
        {
          id: 123,
          ports: [
            'xe-0/0/24'
          ]
        },
        {
          id: 126,
          ports: [
            'xe-0/0/15'
          ]
        },
        {
          id: 128,
          ports: [
            'xe-0/0/12'
          ]
        },
        {
          id: 134,
          ports: [
            'xe-0/0/13'
          ]
        },
        {
          id: 136,
          ports: [
            'xe-0/0/14'
          ]
        },
        {
          id: 150,
          ports: [
            'xe-0/0/50:2'
          ]
        },
        {
          id: 152,
          ports: [
            'xe-0/0/52:0'
          ]
        },
        {
          id: 154,
          ports: [
            'xe-0/0/52:1'
          ]
        },
        {
          id: 156,
          ports: [
            'xe-0/0/50:3'
          ]
        },
        {
          id: 158,
          ports: [
            'xe-0/0/50:0'
          ]
        },
        {
          id: 160,
          ports: [
            'xe-0/0/50:1'
          ]
        },
        {
          id: 162,
          ports: [
            'xe-0/0/52:2'
          ]
        },
        {
          id: 164,
          ports: [
            'xe-0/0/52:3'
          ]
        },
        {
          id: 186,
          ports: [
            'xe-0/0/7'
          ]
        },
        {
          id: 274,
          ports: [
            'xe-0/0/35'
          ]
        },
        {
          id: 276,
          ports: [
            'xe-0/0/37'
          ]
        },
        {
          id: 278,
          ports: [
            'xe-0/0/36'
          ]
        },
        {
          id: 280,
          ports: [
            'xe-0/0/34'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.38.2',
      type: 'managedobject',
      id: '85',
      x: 1147.020176690822,
      y: 2440.505809294712,
      node_id: 85,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkrud9-0-2d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 57,
          ports: [
            '1:20'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.1',
      type: 'managedobject',
      id: '193',
      x: 1174.4435730059495,
      y: 2982.8457802049334,
      node_id: 193,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkdep167-0-11bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 166,
          ports: [
            'GigaEthernet0/6'
          ]
        },
        {
          id: 184,
          ports: [
            'TGigaEthernet0/5'
          ]
        },
        {
          id: 209,
          ports: [
            'GigaEthernet0/7'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.31.189',
      type: 'managedobject',
      id: '86',
      x: 174.39998057277558,
      y: 1446.816763434578,
      node_id: 86,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkvol-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 53,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.31.192',
      type: 'managedobject',
      id: '91',
      x: 358.98463242504045,
      y: 1590.7301170346245,
      node_id: 91,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkos-0-1d26-dgs300026tc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 52,
          ports: [
            '21'
          ]
        },
        {
          id: 190,
          ports: [
            '6'
          ]
        },
        {
          id: 192,
          ports: [
            '7'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.100',
      type: 'managedobject',
      id: '105',
      x: 859.99375,
      y: 3278.7843176001443,
      node_id: 105,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkkap-0-0cd8-fd1208sr1',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.72',
      type: 'managedobject',
      id: '162',
      x: 1348.75,
      y: 3533.6843176001444,
      node_id: 162,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-31-дом--подъезд-5',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.13',
      type: 'managedobject',
      id: '108',
      x: 1159.99375,
      y: 3328.7843176001443,
      node_id: 108,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mknp-0-2bd8-p3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.94',
      type: 'managedobject',
      id: '169',
      x: 2248.75,
      y: 3483.6843176001444,
      node_id: 169,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'ул.118-Павших-Революционеров-36',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.91',
      type: 'managedobject',
      id: '216',
      x: 1504.8166833877233,
      y: 1566.5618284660852,
      node_id: 216,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk763-0-0bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 124,
          ports: [
            'TGigaEthernet0/6'
          ]
        },
        {
          id: 297,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.0.178',
      type: 'managedobject',
      id: '64',
      x: 1641.1800362438821,
      y: 2829.2364410919336,
      node_id: 64,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkhim6-0-2d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 178,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.18',
      type: 'managedobject',
      id: '102',
      x: 1321.3480063005006,
      y: 1539.548424570856,
      node_id: 102,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkdnepr28-0-1bd8-p3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 67,
          ports: [
            'GigaEthernet0/1'
          ]
        },
        {
          id: 131,
          ports: [
            'TGigaEthernet0/2'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.61',
      type: 'managedobject',
      id: '155',
      x: 148.75,
      y: 3383.6843176001444,
      node_id: 155,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--8-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.0.11',
      portal: {
        generator: 'segment',
        id: '6871775a92311a10af76e568',
        settings: null
      },
      type: 'managedobject',
      id: '29',
      x: 2054.7603523472426,
      y: 2550.5118164868018,
      node_id: 29,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkost1-0-9d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 45,
          ports: [
            '1:16'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.7.80',
      type: 'managedobject',
      id: '95',
      x: 1326.3042735284503,
      y: 2177.377302165586,
      node_id: 95,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkrud9b-3-0bd16-bd360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 54,
          ports: [
            'GigaEthernet0/5'
          ]
        },
        {
          id: 56,
          ports: [
            'GigaEthernet0/8'
          ]
        },
        {
          id: 58,
          ports: [
            'TGigaEthernet0/5'
          ]
        },
        {
          id: 61,
          ports: [
            'TGigaEthernet0/2'
          ]
        },
        {
          id: 74,
          ports: [
            'GigaEthernet0/6'
          ]
        },
        {
          id: 76,
          ports: [
            'GigaEthernet0/7'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.16',
      type: 'managedobject',
      id: '101',
      x: 1555.3737840998049,
      y: 1750.9821487553497,
      node_id: 101,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkdnepr28-0-0bd4-p3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 66,
          ports: [
            'GigaEthernet0/4'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.52',
      type: 'managedobject',
      id: '117',
      x: 294.716478213959,
      y: 2496.537132977649,
      node_id: 117,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mktorg48-0-02bd4-p3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 203,
          ports: [
            'GigaEthernet0/6'
          ]
        },
        {
          id: 295,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.116',
      type: 'managedobject',
      id: '176',
      x: 48.75,
      y: 3283.6843176001444,
      node_id: 176,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Distribution-Солнечный-дом-8-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 284,
          ports: [
            '26'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.43',
      type: 'managedobject',
      id: '125',
      x: 1848.75,
      y: 3433.6843176001444,
      node_id: 125,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-19-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.69',
      type: 'managedobject',
      id: '159',
      x: 1048.75,
      y: 3483.6843176001444,
      node_id: 159,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-31-Дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.36.86',
      type: 'managedobject',
      id: '65',
      x: 1912.0284046922134,
      y: 1873.3671401537033,
      node_id: 65,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk35-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 48,
          ports: [
            '1:24'
          ]
        },
        {
          id: 50,
          ports: [
            '1:23'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.76',
      type: 'managedobject',
      id: '94',
      x: 1905.3768494996693,
      y: 1380.1231318407515,
      node_id: 94,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk761-0-bd18-p3608',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 169,
          ports: [
            'GigaEthernet0/6'
          ]
        },
        {
          id: 170,
          ports: [
            'GigaEthernet0/3'
          ]
        },
        {
          id: 175,
          ports: [
            'GigaEthernet0/2'
          ]
        },
        {
          id: 177,
          ports: [
            'GigaEthernet0/7'
          ]
        },
        {
          id: 228,
          ports: [
            'GigaEthernet0/1'
          ]
        },
        {
          id: 245,
          ports: [
            'GigaEthernet0/4'
          ]
        },
        {
          id: 296,
          ports: [
            'TGigaEthernet0/2'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.36',
      type: 'managedobject',
      id: '200',
      x: 1116.1554173812256,
      y: 2114.4620177164384,
      node_id: 200,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mknikit125-0-05bd4-bdp3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 219,
          ports: [
            'GigaEthernet0/6'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.46',
      type: 'managedobject',
      id: '140',
      x: 2048.75,
      y: 3433.6843176001444,
      node_id: 140,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-20-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.55',
      type: 'managedobject',
      id: '149',
      x: 1848.75,
      y: 3483.6843176001444,
      node_id: 149,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-34-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.54',
      type: 'managedobject',
      id: '195',
      x: 905.9777116460713,
      y: 1877.0565704830487,
      node_id: 195,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mklip4-0-02bd8-p3600',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 173,
          ports: [
            'TGigaEthernet0/6'
          ]
        },
        {
          id: 210,
          ports: [
            'TGigaEthernet0/1'
          ]
        },
        {
          id: 243,
          ports: [
            'TGigaEthernet0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.112',
      type: 'managedobject',
      id: '87',
      x: 1792.7380776809389,
      y: 1936.809883727426,
      node_id: 87,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mksun8-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 71,
          ports: [
            '1:20'
          ]
        },
        {
          id: 73,
          ports: [
            '1:3'
          ]
        },
        {
          id: 254,
          ports: [
            '1:23'
          ]
        },
        {
          id: 309,
          ports: [
            '1:14'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.31',
      type: 'managedobject',
      id: '199',
      x: 627.1239030278942,
      y: 1720.8535662906595,
      node_id: 199,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mknikit125-0-04bd8-p3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 191,
          ports: [
            'GigaEthernet0/5'
          ]
        },
        {
          id: 193,
          ports: [
            'GigaEthernet0/6'
          ]
        },
        {
          id: 217,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.11',
      type: 'managedobject',
      id: '182',
      x: 1323.1011725869673,
      y: 2558.17877717634,
      node_id: 182,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mklom-0-2bd8-bd3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 267,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.15',
      type: 'managedobject',
      id: '179',
      x: 1597.8239465393456,
      y: 2935.2548114198635,
      node_id: 179,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkvis-0-2bd4-bdp3310c',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 85,
          ports: [
            'GigaEthernet0/3'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.36.116',
      type: 'managedobject',
      id: '83',
      x: 1348.75,
      y: 3333.6843176001444,
      node_id: 83,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkrud36-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.34.230',
      type: 'managedobject',
      id: '76',
      x: 2175.086510991339,
      y: 1365.8225889494704,
      node_id: 76,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk763-0-3d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 168,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.20',
      type: 'managedobject',
      id: '143',
      x: 648.75,
      y: 3433.6843176001444,
      node_id: 143,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--9-дом--подъезд-4',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.30',
      type: 'managedobject',
      id: '201',
      x: 1073.2969849374124,
      y: 1664.644242540019,
      node_id: 201,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkcherb1-0-0bd16-p360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 138,
          ports: [
            'GigaEthernet0/8'
          ]
        },
        {
          id: 140,
          ports: [
            'TGigaEthernet0/6'
          ]
        },
        {
          id: 143,
          ports: [
            'GigaEthernet0/5'
          ]
        },
        {
          id: 225,
          ports: [
            'TGigaEthernet0/1'
          ]
        },
        {
          id: 227,
          ports: [
            'TGigaEthernet0/3'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.36.88',
      type: 'managedobject',
      id: '77',
      x: 1967.0975676143657,
      y: 1666.5786209618277,
      node_id: 77,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk35-0-2d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 46,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.96',
      type: 'managedobject',
      id: '81',
      x: 1512.30986002707,
      y: 1337.7866232936876,
      node_id: 81,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mksun22-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 236,
          ports: [
            '1:24'
          ]
        },
        {
          id: 272,
          ports: [
            '1:12'
          ]
        },
        {
          id: 286,
          ports: [
            '1:7'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.34',
      type: 'managedobject',
      id: '135',
      x: 2148.75,
      y: 3383.6843176001444,
      node_id: 135,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-20-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.21',
      type: 'managedobject',
      id: '118',
      x: 119.9875000000001,
      y: 2156.2461926490146,
      node_id: 118,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkavt1a-0-0bd16-bdp3600-16e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 306,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.1.164',
      type: 'managedobject',
      id: '55',
      x: 1776.237457579693,
      y: 1323.5237666255407,
      node_id: 55,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkrud4-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 145,
          ports: [
            '1:24'
          ]
        },
        {
          id: 291,
          ports: [
            '1:23'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.33.200',
      portal: {
        generator: 'segment',
        id: '687170154d04abddc979821c',
        settings: null
      },
      type: 'managedobject',
      id: '23',
      x: 1199.7006816178116,
      y: 920.6715104409027,
      node_id: 23,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkzap-0-2d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 26,
          ports: [
            '1:3'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.0.222',
      type: 'managedobject',
      id: '63',
      x: 2122.904606433736,
      y: 1231.6691574550455,
      node_id: 63,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk763-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 176,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.81',
      type: 'managedobject',
      id: '209',
      x: 1933.5616956360507,
      y: 1556.8983040365008,
      node_id: 209,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkmak63-0-3bd16-bdp360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 114,
          ports: [
            'TGigaEthernet0/6'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.33.16',
      type: 'managedobject',
      id: '66',
      x: 1106.899479256525,
      y: 2045.6594348789768,
      node_id: 66,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkbat-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 249,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.0.189',
      type: 'managedobject',
      id: '58',
      x: 867.1701303036176,
      y: 2230.4925444506835,
      node_id: 58,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkk74-0-2d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 40,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.38.38',
      type: 'managedobject',
      id: '90',
      x: 2003.1858149339091,
      y: 1133.9708586249253,
      node_id: 90,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk763-0-12d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 244,
          ports: [
            '1:1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.0.252',
      type: 'managedobject',
      id: '61',
      x: 2158.65597530626,
      y: 1508.3253027943406,
      node_id: 61,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk763-0-2d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 229,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.49',
      type: 'managedobject',
      id: '205',
      x: 1491.7819050548196,
      y: 2650.1788330131317,
      node_id: 205,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkkir14a-0-01bd8-p36082te',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 84,
          ports: [
            'GigaEthernet0/2'
          ]
        },
        {
          id: 147,
          ports: [
            'GigaEthernet0/3'
          ]
        },
        {
          id: 194,
          ports: [
            'TGigaEthernet0/1'
          ]
        },
        {
          id: 271,
          ports: [
            'TGigaEthernet0/2'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.37.1',
      type: 'managedobject',
      id: '54',
      x: 948.6867748342486,
      y: 1356.3559273040703,
      node_id: 54,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkob-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 142,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.74',
      type: 'managedobject',
      id: '164',
      x: 848.75,
      y: 3483.6843176001444,
      node_id: 164,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-30-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.78',
      type: 'managedobject',
      id: '166',
      x: 1316.5401784076125,
      y: 2052.068556883219,
      node_id: 166,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'ул.Островского-8',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 293,
          ports: [
            '26'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.0.248',
      type: 'managedobject',
      id: '60',
      x: 1562.4886440441978,
      y: 2486.3738851007347,
      node_id: 60,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkhim6-0-1d24-dgs312024sc',
      shape: 'Cisco/layer_3_switch',
      shape_width: 40,
      shape_height: 40,
      shape_overlay: [],
      ports: [
        {
          id: 198,
          ports: [
            '1:23'
          ]
        },
        {
          id: 200,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.0.153',
      type: 'managedobject',
      id: '57',
      x: 1188.015988017884,
      y: 2049.0339913645917,
      node_id: 57,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkk74-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 41,
          ports: [
            '1:13'
          ]
        },
        {
          id: 42,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.22',
      type: 'managedobject',
      id: '198',
      x: 965.4793287482238,
      y: 1810.933927771503,
      node_id: 198,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mknikit125-0-03bd8-p3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 207,
          ports: [
            'GigaEthernet0/8'
          ]
        },
        {
          id: 211,
          ports: [
            'TGigaEthernet0/6'
          ]
        },
        {
          id: 212,
          ports: [
            'TGigaEthernet0/2'
          ]
        },
        {
          id: 214,
          ports: [
            'TGigaEthernet0/1'
          ]
        },
        {
          id: 216,
          ports: [
            'TGigaEthernet0/3'
          ]
        },
        {
          id: 218,
          ports: [
            'GigaEthernet0/7'
          ]
        },
        {
          id: 220,
          ports: [
            'GigaEthernet0/6'
          ]
        },
        {
          id: 223,
          ports: [
            'GigaEthernet0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.34.220',
      type: 'managedobject',
      id: '71',
      x: 852.3313871213708,
      y: 1757.2376985206138,
      node_id: 71,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk763-0-10d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 204,
          ports: [
            '1:17'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.104',
      type: 'managedobject',
      id: '100',
      x: 1357.3965863841413,
      y: 2441.3107583138044,
      node_id: 100,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkrud9b-0-2bd4-bd3310C',
      shape: 'Cisco/router',
      shape_width: 47.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 77,
          ports: [
            'GigaEthernet0/6'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.38.1',
      type: 'managedobject',
      id: '79',
      x: 1680.002041039571,
      y: 1580.0796075555743,
      node_id: 79,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk763-0-11d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 171,
          ports: [
            '1:1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.107',
      type: 'managedobject',
      id: '175',
      x: 2148.75,
      y: 3533.6843176001444,
      node_id: 175,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'ул.-Московская-68',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.38',
      type: 'managedobject',
      id: '120',
      x: 1610.3999342184657,
      y: 1045.893325776136,
      node_id: 120,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-18-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 303,
          ports: [
            '25'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.7',
      type: 'managedobject',
      id: '133',
      x: 1977.4552102394882,
      y: 1777.9893846263883,
      node_id: 133,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-11-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 70,
          ports: [
            '25'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.21',
      type: 'managedobject',
      id: '126',
      x: 1988.032727963957,
      y: 2138.2161188128925,
      node_id: 126,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--8-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 72,
          ports: [
            '25'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.8',
      type: 'managedobject',
      id: '124',
      x: 1048.75,
      y: 3433.6843176001444,
      node_id: 124,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-10-дом--подъезд-4',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.35',
      type: 'managedobject',
      id: '131',
      x: 1705.0370009304513,
      y: 1170.816495600208,
      node_id: 131,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-17-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 287,
          ports: [
            '25'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.31.85',
      type: 'managedobject',
      id: '34',
      x: 2507.156389859947,
      y: 2160.9926348972053,
      node_id: 34,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk15line-0-0d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 38,
          ports: [
            '1:1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.88',
      type: 'managedobject',
      id: '138',
      x: 448.75,
      y: 3433.6843176001444,
      node_id: 138,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный--9-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.73',
      type: 'managedobject',
      id: '163',
      x: 1448.75,
      y: 3483.6843176001444,
      node_id: 163,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-31-дом--подъезд-6',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.58',
      type: 'managedobject',
      id: '152',
      x: 448.75,
      y: 3483.6843176001444,
      node_id: 152,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-27-дом--подъезд-4',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.34.1',
      type: 'managedobject',
      id: '72',
      x: 1836.3881047322986,
      y: 1103.7371195650596,
      node_id: 72,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk763-0-13d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 174,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.25.255.8',
      portal: {
        generator: 'segment',
        id: '6871775a92311a10af76e568',
        settings: null
      },
      type: 'managedobject',
      id: '25',
      x: 1625.9669681570417,
      y: 1716.7041573901502,
      node_id: 25,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkost1-0-10d28-dgs300028sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 29,
          ports: [
            '28'
          ]
        },
        {
          id: 30,
          ports: [
            '23'
          ]
        },
        {
          id: 47,
          ports: [
            '24'
          ]
        },
        {
          id: 49,
          ports: [
            '21'
          ]
        },
        {
          id: 51,
          ports: [
            '22'
          ]
        },
        {
          id: 115,
          ports: [
            '25'
          ]
        },
        {
          id: 149,
          ports: [
            '17'
          ]
        },
        {
          id: 251,
          ports: [
            '9'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.39',
      type: 'managedobject',
      id: '145',
      x: 1548.75,
      y: 3383.6843176001444,
      node_id: 145,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-17-дом--подъезд-3',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.34.229',
      type: 'managedobject',
      id: '75',
      x: 1157.236153274701,
      y: 2772.3078015198785,
      node_id: 75,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkmet-0-1d24-dgs312024sc',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [
        {
          id: 182,
          ports: [
            '1:24'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.81',
      type: 'managedobject',
      id: '168',
      x: 848.75,
      y: 3433.6843176001444,
      node_id: 168,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-10-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.24',
      type: 'managedobject',
      id: '121',
      x: 1948.75,
      y: 3383.6843176001444,
      node_id: 121,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-19-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.52',
      type: 'managedobject',
      id: '147',
      x: 648.75,
      y: 3483.6843176001444,
      node_id: 147,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-28-дом--подъезд-2',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.54',
      type: 'managedobject',
      id: '148',
      x: 1948.75,
      y: 3533.6843176001444,
      node_id: 148,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-34-дом--подъезд-5',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'downlink',
      address: '172.28.100.35',
      portal: {
        generator: 'segment',
        id: '687177524d04abddc979823c',
        settings: null
      },
      type: 'managedobject',
      id: '217',
      x: 1773.385751046783,
      y: 1768.6901386455515,
      node_id: 217,
      metrics_label: '',
      metrics_template: '',
      level: 175,
      name: 'mklen117-0-42jmx204-bras05-christofer',
      shape: 'Cisco/broadband_router_d',
      shape_width: 47.5,
      shape_height: 47.5,
      shape_overlay: [],
      ports: [
        {
          id: 127,
          ports: [
            'xe-0/1/7'
          ]
        },
        {
          id: 129,
          ports: [
            'xe-0/1/0'
          ]
        },
        {
          id: 135,
          ports: [
            'xe-0/1/1'
          ]
        },
        {
          id: 137,
          ports: [
            'xe-0/1/6'
          ]
        },
        {
          id: 151,
          ports: [
            'xe-0/0/0:2'
          ]
        },
        {
          id: 153,
          ports: [
            'xe-0/0/1:0'
          ]
        },
        {
          id: 155,
          ports: [
            'xe-0/0/1:1'
          ]
        },
        {
          id: 157,
          ports: [
            'xe-0/0/0:3'
          ]
        },
        {
          id: 159,
          ports: [
            'xe-0/0/0:0'
          ]
        },
        {
          id: 161,
          ports: [
            'xe-0/0/0:1'
          ]
        },
        {
          id: 163,
          ports: [
            'xe-0/0/1:2'
          ]
        },
        {
          id: 165,
          ports: [
            'xe-0/0/1:3'
          ]
        },
        {
          id: 275,
          ports: [
            'xe-0/1/3'
          ]
        },
        {
          id: 277,
          ports: [
            'xe-0/1/5'
          ]
        },
        {
          id: 279,
          ports: [
            'xe-0/1/4'
          ]
        },
        {
          id: 281,
          ports: [
            'xe-0/1/2'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: true
    },
    {
      role: 'segment',
      address: '172.25.3.95',
      type: 'managedobject',
      id: '171',
      x: 148.75,
      y: 3533.6843176001444,
      node_id: 171,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-261-дом-8-этаж',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.16',
      type: 'managedobject',
      id: '174',
      x: 1248.75,
      y: 3433.6843176001444,
      node_id: 174,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-11-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.3.56',
      type: 'managedobject',
      id: '150',
      x: 248.75,
      y: 3483.6843176001444,
      node_id: 150,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'Солнечный-27-дом--подъезд-1',
      shape: 'Cisco/workgroup_switch',
      shape_width: 62.5,
      shape_height: 32.5,
      shape_overlay: [],
      ports: [],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.24',
      type: 'managedobject',
      id: '98',
      x: 1562.3635544009423,
      y: 1555.561175631091,
      node_id: 98,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkrud4-0-1bd16-bd360016e',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 144,
          ports: [
            'GigaEthernet0/6'
          ]
        },
        {
          id: 240,
          ports: [
            'TGigaEthernet0/5'
          ]
        },
        {
          id: 290,
          ports: [
            'GigaEthernet0/5'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.50',
      type: 'managedobject',
      id: '181',
      x: 1323.0279329787008,
      y: 2885.914686859642,
      node_id: 181,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mk3bislen7-0-2bd8-bd3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 146,
          ports: [
            'GigaEthernet0/1'
          ]
        },
        {
          id: 195,
          ports: [
            'TGigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    },
    {
      role: 'segment',
      address: '172.25.7.19',
      type: 'managedobject',
      id: '221',
      x: 1520.856680058242,
      y: 1437.8693035063536,
      node_id: 221,
      metrics_label: '',
      metrics_template: '',
      level: 25,
      name: 'mkpap1-0-1bd8-p3608b',
      shape: 'Cisco/intelliswitch_stack',
      shape_width: 40.0125,
      shape_height: 42.3,
      shape_overlay: [],
      ports: [
        {
          id: 148,
          ports: [
            'GigaEthernet0/1'
          ]
        }
      ],
      caps: [],
      object_filter: null,
      external: false
    }
  ],
  links: [
    {
      connector: 'normal',
      id: '691e3ab7b11516a2d8ba97f1',
      type: 'link',
      method: 'lldp',
      ports: [
        262,
        263
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65905dca265b54ff232bfaa3',
      type: 'link',
      method: 'lldp',
      ports: [
        38,
        39
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '666882d9b1a46f3fd536ecde',
      type: 'link',
      method: 'lldp',
      ports: [
        80,
        81
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6587791256cc0e5ff031c711',
      type: 'link',
      method: 'lldp',
      ports: [
        34,
        35
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65f5954e7e69a060dee5d0c0',
      type: 'link',
      method: 'lldp',
      ports: [
        64,
        65
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6914e922871647735bf0895b',
      type: 'link',
      method: 'lldp',
      ports: [
        256,
        257
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '666308a7ec55e3fb77698be4',
      type: 'link',
      method: 'lldp',
      ports: [
        78,
        79
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6982c581ec47a84df5a278aa',
      type: 'link',
      method: 'lldp',
      ports: [
        304,
        305
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65c11f2d1fba36cbc6315363',
      type: 'link',
      method: 'lldp',
      ports: [
        44,
        45
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '69538de784d367e692cf88b9',
      type: 'link',
      method: 'lldp',
      ports: [
        282,
        283
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65e2f0ab2b06893527d92a56',
      type: 'link',
      method: 'lldp',
      ports: [
        62,
        63
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '687ad66cc64cc0b4f71f125b',
      type: 'link',
      method: 'lldp',
      ports: [
        206,
        207
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68b1a31f104b868a58c9b2da',
      type: 'link',
      method: 'lldp',
      ports: [
        238,
        239
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '697a00d1e1734227d87d43a8',
      type: 'link',
      method: 'lldp',
      ports: [
        298,
        299
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6707a09eb882351e75c7954d',
      type: 'link',
      method: 'lldp',
      ports: [
        138,
        139
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '658560367be5ae1ba8cc2334',
      type: 'link',
      method: 'lldp',
      ports: [
        30,
        31
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65cf47bd066d181b10ce3a40',
      type: 'link',
      method: 'lldp',
      ports: [
        60,
        61
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '656703612d2313a64c3be1c0',
      type: 'link',
      method: 'lacp',
      ports: [
        18,
        19
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '656eee362d2313a64c3bfe1c',
      type: 'link',
      method: 'lacp',
      ports: [
        24,
        25
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '676d3b4649f90335236fd528',
      type: 'link',
      method: 'lldp',
      ports: [
        180,
        181
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68e4e22e230bb33d5dd96645',
      type: 'link',
      method: 'lldp',
      ports: [
        248,
        249
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68e4e236230bb33d5dd96646',
      type: 'link',
      method: 'lldp',
      ports: [
        250,
        251
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '668289569ccb3ac4acdff43b',
      type: 'link',
      method: 'lacp',
      ports: [
        112,
        113
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '691fb096346b1dc32d4e1861',
      type: 'link',
      method: 'lldp',
      ports: [
        264,
        265
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '661ba7065a4e015717199243',
      type: 'link',
      method: 'lldp',
      ports: [
        68,
        69
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '687ad73e044c7a9f805538e5',
      type: 'link',
      method: 'lldp',
      ports: [
        208,
        209
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68cb9933274fd7165e309ee6',
      type: 'link',
      method: 'lldp',
      ports: [
        246,
        247
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '696a7e22aefe90f623b63bf5',
      type: 'link',
      method: 'lldp',
      ports: [
        284,
        285
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '658776bceac4e9749d804796',
      type: 'link',
      method: 'lldp',
      ports: [
        32,
        33
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6894726c0d85f8caec7d492c',
      type: 'link',
      method: 'lldp',
      ports: [
        226,
        227
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68b16d1aa093bc866b1d383c',
      type: 'link',
      method: 'lldp',
      ports: [
        232,
        233
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6970888a747a5997e6d65c10',
      type: 'link',
      method: 'lldp',
      ports: [
        292,
        293
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6980a7e8c6b4adfe40acf23a',
      type: 'link',
      method: 'lldp',
      ports: [
        302,
        303
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6772866349f9033523722b5d',
      type: 'link',
      method: 'lldp',
      ports: [
        186,
        187
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '693ff95e66935c6f5d2afb2b',
      type: 'link',
      method: 'lldp',
      ports: [
        272,
        273
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '689b9781dcd5d942e8b0c09f',
      type: 'link',
      method: 'lldp',
      ports: [
        230,
        231
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68b175e8104b868a58c99ced',
      type: 'link',
      method: 'lldp',
      ports: [
        234,
        235
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '696e49c24ad3f42f984b59de',
      type: 'link',
      method: 'lldp',
      ports: [
        288,
        289
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '661e43615e36a18b2aefd842',
      type: 'link',
      method: 'lldp',
      ports: [
        74,
        75
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '69714b7ba2cd5de40679ad36',
      type: 'link',
      method: 'lldp',
      ports: [
        294,
        295
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6984b63becb491a2d1252436',
      type: 'link',
      method: 'lldp',
      ports: [
        306,
        307
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6584ef2a6a2e01a39962fce8',
      type: 'link',
      method: 'lldp',
      ports: [
        26,
        27
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '666977df41a2990e20a7431b',
      type: 'link',
      method: 'lldp',
      ports: [
        82,
        83
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '67487ae6a76a1b69bbc4a888',
      type: 'link',
      method: 'lldp',
      ports: [
        172,
        173
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6838589f3a21ed0fe348c9f7',
      type: 'link',
      method: 'lldp',
      ports: [
        196,
        197
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '691fb097346b1dc32d4e1862',
      type: 'link',
      method: 'lldp',
      ports: [
        266,
        267
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '691fb09b346b1dc32d4e1863',
      type: 'link',
      method: 'lldp',
      ports: [
        268,
        269
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '691fb09d346b1dc32d4e1864',
      type: 'link',
      method: 'lldp',
      ports: [
        270,
        271
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6587e1f7c8a6d44107705fce',
      type: 'link',
      method: 'lldp',
      ports: [
        36,
        37
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65c11c8534cb1dcd6431c685',
      type: 'link',
      method: 'lldp',
      ports: [
        42,
        43
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68b17b3f9ece9b4f4b362fc0',
      type: 'link',
      method: 'lldp',
      ports: [
        236,
        237
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68f6146f6215181c59634d56',
      type: 'link',
      method: 'lldp',
      ports: [
        254,
        255
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '697bc9d547452957ef73a833',
      type: 'link',
      method: 'lldp',
      ports: [
        300,
        301
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6914fcdee62a51d9c3c7d0c7',
      type: 'link',
      method: 'lldp',
      ports: [
        258,
        259
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '676d3ad4f4690545b23d0d65',
      type: 'link',
      method: 'lldp',
      ports: [
        178,
        179
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '676d3bd449f90335236fd548',
      type: 'link',
      method: 'lldp',
      ports: [
        182,
        183
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '676d48e2f49f4251e3432eff',
      type: 'link',
      method: 'lldp',
      ports: [
        184,
        185
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6842f6e9c82e273a080e94ab',
      type: 'link',
      method: 'lldp',
      ports: [
        200,
        201
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6984d8b5e48ee079bb2b26a6',
      type: 'link',
      method: 'lldp',
      ports: [
        308,
        309
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '66fba6f09b0b38e91819e7c7',
      type: 'link',
      method: 'lldp',
      ports: [
        130,
        131
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68f18fc01cb460c1f71ce86c',
      type: 'link',
      method: '',
      ports: [
        252,
        253
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '69150072bd7116e094ccf1bf',
      type: 'link',
      method: 'lldp',
      ports: [
        260,
        261
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '687ae56c1689c0fe785551b4',
      type: 'link',
      method: 'lldp',
      ports: [
        222,
        223
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6688eac7666b65a2a70a29b6',
      type: 'link',
      method: 'lacp',
      ports: [
        122,
        123
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '656b01fd5c86e3f71774426a',
      type: 'link',
      method: 'lacp',
      ports: [
        22,
        23
      ],
      in_bw: 40000000000,
      out_bw: 40000000000,
      bw: 40000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65856019ec110e342671ab96',
      type: 'link',
      method: 'lldp',
      ports: [
        28,
        29
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65ca98a7f70bbbf42fe44c2a',
      type: 'link',
      method: 'lldp',
      ports: [
        58,
        59
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '66ec34e383671a125f48b9ff',
      type: 'link',
      method: 'lldp',
      ports: [
        124,
        125
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6707a0a6b882351e75c7954e',
      type: 'link',
      method: 'lldp',
      ports: [
        140,
        141
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6861083f7a1b1d105b853d4f',
      type: 'link',
      method: 'lldp',
      ports: [
        204,
        205
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '687ad81f044c7a9f80553d6d',
      type: 'link',
      method: 'lldp',
      ports: [
        214,
        215
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68b94f1e1018f32797b22731',
      type: 'link',
      method: 'lldp',
      ports: [
        240,
        241
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68b9501a1281f9e5672ff797',
      type: 'link',
      method: 'lldp',
      ports: [
        242,
        243
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '673b842ee9a1f8170a35bd39',
      type: 'link',
      method: 'lldp',
      ports: [
        166,
        167
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6952bd148ccf2b59d421c2db',
      type: 'link',
      method: 'lldp',
      ports: [
        280,
        281
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65ca98a3f70bbbf42fe44c29',
      type: 'link',
      method: 'lldp',
      ports: [
        56,
        57
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65c7bd4b569ba57b5389f46a',
      type: 'link',
      method: 'lldp',
      ports: [
        52,
        53
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '67f397ff80c85fe3f1eb7ff9',
      type: 'link',
      method: 'lldp',
      ports: [
        192,
        193
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6972eacda9b6ab99ba3bf7b5',
      type: 'link',
      method: 'lldp',
      ports: [
        296,
        297
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '660a982f87b8eb07ad7e616a',
      type: 'link',
      method: 'lldp',
      ports: [
        66,
        67
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '661e43625e36a18b2aefd843',
      type: 'link',
      method: 'lldp',
      ports: [
        76,
        77
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65c122b01fba36cbc631550e',
      type: 'link',
      method: 'lldp',
      ports: [
        50,
        51
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6743eff7e7aa147766cfd40b',
      type: 'link',
      method: 'lldp',
      ports: [
        168,
        169
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6743f01882bd7fcbfe2e15d0',
      type: 'link',
      method: 'lldp',
      ports: [
        170,
        171
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '676c00b115d7e8baaf96812d',
      type: 'link',
      method: 'lldp',
      ports: [
        174,
        175
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '676d15a649f90335236fc4ff',
      type: 'link',
      method: 'lldp',
      ports: [
        176,
        177
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6897e868c4c842b5150f60a0',
      type: 'link',
      method: 'lldp',
      ports: [
        228,
        229
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '68bfb28108b15eca50e201b6',
      type: 'link',
      method: 'lldp',
      ports: [
        244,
        245
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '687ad822044c7a9f80553d6f',
      type: 'link',
      method: 'lldp',
      ports: [
        218,
        219
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '687ad79c21a12b415270bda3',
      type: 'link',
      method: 'lldp',
      ports: [
        210,
        211
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '661c380e5a4e01571719a412',
      type: 'link',
      method: 'lldp',
      ports: [
        70,
        71
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '661c39940cbea17e6058f7c2',
      type: 'link',
      method: 'lldp',
      ports: [
        72,
        73
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '687ad820044c7a9f80553d6e',
      type: 'link',
      method: 'lldp',
      ports: [
        216,
        217
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '666acfbb3f57547ee398157e',
      type: 'link',
      method: 'lldp',
      ports: [
        84,
        85
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6707b0cc2c3f8779b1b11070',
      type: 'link',
      method: 'lldp',
      ports: [
        142,
        143
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65c122a31fba36cbc631550c',
      type: 'link',
      method: 'lldp',
      ports: [
        46,
        47
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '696e480e281e6af7d1c95d86',
      type: 'link',
      method: 'lldp',
      ports: [
        286,
        287
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '696e94b0c62cc855fce5d07d',
      type: 'link',
      method: 'lldp',
      ports: [
        290,
        291
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '6685aecf955e83e90d924edf',
      type: 'link',
      method: 'lldp',
      ports: [
        114,
        115
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '65c11c741aae555022bb51cf',
      type: 'link',
      method: 'lldp',
      ports: [
        40,
        41
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '680a0f8be586c31e8a7f434d',
      type: 'link',
      method: 'lldp',
      ports: [
        194,
        195
      ],
      in_bw: 10000000000,
      out_bw: 10000000000,
      bw: 10000000000,
      weight: 1
    },
    {
      connector: 'normal',
      id: '672e41704eedb1e2e12934d6',
      type: 'link',
      method: 'lldp',
      ports: [
        148,
        149
      ],
      in_bw: 1000000000,
      out_bw: 1000000000,
      bw: 1000000000,
      weight: 1
    }
  ]
};

