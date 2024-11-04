menu_ids = event.get("menu_ids")&.split("^") || []
menu_names = event.get("menu_names")&.split("^") || []
menu_prices = event.get("menu_prices")&.split("^") || []

menus = []

menu_names.each_with_index do |name, index|
  menu = { "name" => name }
  price = index < menu_prices.size ? menu_prices[index].to_i : nil
  menu["price"] = price unless price.nil?
  menu["id"] = menu_ids[index].to_i
  menus.push(menu)
end

event.set("menus", menus)
event.remove("menu_names")
event.remove("menu_prices")
event.remove("menu_ids")