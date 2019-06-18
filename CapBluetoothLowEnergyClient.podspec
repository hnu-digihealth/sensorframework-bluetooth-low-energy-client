
  Pod::Spec.new do |s|
    s.name = 'CapBluetoothLowEnergyClient'
    s.version = '0.0.1'
    s.summary = 'Capacitor Bluetooth Low Energy Client Plugin'
    s.license = 'MIT'
    s.homepage = 'https://github.com/robmarti/cap-bluetooth-low-energy-client.git'
    s.author = 'robmarti'
    s.source = { :git => 'https://github.com/robmarti/cap-bluetooth-low-energy-client.git', :tag => s.version.to_s }
    s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'
    s.ios.deployment_target  = '11.0'
    s.dependency 'Capacitor'
  end