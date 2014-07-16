class AssetAnalysis

  require 'open-uri'

  DAYS = ["today", "yesterday", "two_days_ago", "three_days_ago", "four_days_ago", "five_days_ago", "six_days_ago", "last_week"]

  private

  def dates
    dates = {}
    DAYS.each_with_index do |day_of_week, index|
      dates[:"#{day_of_week}"] = index.day.ago.strftime("%Y-%m-%d")
    end
    dates
  end

  def compare_stats(current, previous)
    result = ((current.to_f/previous.to_f)*100 - 100).round(1)
    result == 0.0 ? result.round : result
  end

  def add_comparison_stats
    @stats[:today].each do |statistic|
      statistic[:compare] = {
        yesterday: compare_stats(statistic[:sizes][:size], get_filesize(@stats[:yesterday].find {|y| y[:id] == statistic[:id]})),
        last_week: compare_stats(statistic[:sizes][:size], get_filesize(@stats[:last_week].find {|y| y[:id] == statistic[:id]}))
      }
    end
  end

  def order_stats
    @stats[:today].sort { |x,y| y[:sizes][:size].to_i <=> x[:sizes][:size].to_i}
  end

  def fetch_stats(type)
    stats = {}
    DAYS.each do |day_of_week|
      suffix = dates[:"#{day_of_week}"]
      begin
        stats[:"#{day_of_week}"] = JSON.parse(open("http://assets.staticlp.com/perf/#{type}-analysis/result-#{suffix}.json").read).map do |stat|
          stat = stat.deep_symbolize_keys
          type == "css" && stat[:result].blank? ? nil : decorated_stat(stat)
        end.compact
      rescue
        stats[:"#{day_of_week}"] = []
      end
    end
    stats
  end

  def chart_data_for_file(file)
    {
      key: file[:id],
      values: DAYS.reverse.map do |day|
        {
          x: DAYS.length - DAYS.index(day),
          y: get_filesize(@stats[:"#{day}"].find {|y| y[:id] == file[:id]})
        }
      end
    }
  end

  def get_filesize(stat)
    stat.present? ? stat[:sizes][:size] : 1
  end

end
