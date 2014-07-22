module UiHelper

  def ui_alert_classes(properties, classes = [])
    classes.push("is-closed") if properties[:animate]
    classes.push("alert--#{properties[:type].downcase}")
    classes.push("icon--#{alert_class_mapping[:"#{properties[:type].downcase}"]}--before")
    return classes.join(" ")
  end

  private

  def alert_class_mapping
    {
      success: "tick",
      error: "cross",
      warning: "caution",
      announcement: "loudspeaker"
    }
  end

end
